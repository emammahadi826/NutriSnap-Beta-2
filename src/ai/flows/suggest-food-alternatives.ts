'use server';
/**
 * @fileOverview Provides alternative food suggestions based on an initial AI food recognition result with low confidence.
 *
 * - suggestFoodAlternatives - A function that suggests alternative food options.
 * - SuggestFoodAlternativesInput - The input type for the suggestFoodAlternatives function.
 * - SuggestFoodAlternativesOutput - The return type for the suggestFoodAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFoodAlternativesInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  initialRecognition: z
    .string()
    .describe('The initial food recognition result with low confidence.'),
});
export type SuggestFoodAlternativesInput = z.infer<
  typeof SuggestFoodAlternativesInputSchema
>;

const SuggestFoodAlternativesOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of alternative food suggestions.'),
});
export type SuggestFoodAlternativesOutput = z.infer<
  typeof SuggestFoodAlternativesOutputSchema
>;

export async function suggestFoodAlternatives(
  input: SuggestFoodAlternativesInput
): Promise<SuggestFoodAlternativesOutput> {
  return suggestFoodAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFoodAlternativesPrompt',
  input: {schema: SuggestFoodAlternativesInputSchema},
  output: {schema: SuggestFoodAlternativesOutputSchema},
  prompt: `The AI has low confidence in the initial food recognition.  Given the photo and the initial recognition, suggest alternative foods that the user may have taken a picture of.

Initial Recognition: {{{initialRecognition}}}
Photo: {{media url=imageUri}}

Suggestions:`,
});

const suggestFoodAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestFoodAlternativesFlow',
    inputSchema: SuggestFoodAlternativesInputSchema,
    outputSchema: SuggestFoodAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
