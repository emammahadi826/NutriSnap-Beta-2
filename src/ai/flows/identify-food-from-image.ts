'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying food items from an image.
 *
 * It takes an image as input and returns a list of identified food items with estimated portion sizes.
 * - identifyFoodFromImage - A function that handles the food identification process.
 * - IdentifyFoodFromImageInput - The input type for the identifyFoodFromImage function.
 * - IdentifyFoodFromImageOutput - The return type for the identifyFoodFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyFoodFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyFoodFromImageInput = z.infer<typeof IdentifyFoodFromImageInputSchema>;

const IdentifyFoodFromImageOutputSchema = z.object({
  foodItems: z.array(
    z.object({
      name: z.string().describe('The name of the identified food item.'),
      portionEstimate: z
        .string()
        .describe('An estimate of the portion size of the food item.'),
      confidence: z.number().describe('Confidence level of the food identification.'),
    })
  ).describe('A list of identified food items in the image.'),
});
export type IdentifyFoodFromImageOutput = z.infer<typeof IdentifyFoodFromImageOutputSchema>;

export async function identifyFoodFromImage(input: IdentifyFoodFromImageInput): Promise<IdentifyFoodFromImageOutput> {
  return identifyFoodFromImageFlow(input);
}

const identifyFoodFromImagePrompt = ai.definePrompt({
  name: 'identifyFoodFromImagePrompt',
  input: {schema: IdentifyFoodFromImageInputSchema},
  output: {schema: IdentifyFoodFromImageOutputSchema},
  prompt: `You are an AI trained to identify food items in images and estimate their portion sizes.

  Analyze the image and identify all the visible food items. Provide an estimate of the portion size for each item.

  Return the identified food items and portion sizes in JSON format.

  Image: {{media url=photoDataUri}}
  `,
});

const identifyFoodFromImageFlow = ai.defineFlow(
  {
    name: 'identifyFoodFromImageFlow',
    inputSchema: IdentifyFoodFromImageInputSchema,
    outputSchema: IdentifyFoodFromImageOutputSchema,
  },
  async input => {
    const {output} = await identifyFoodFromImagePrompt(input);
    return output!;
  }
);
