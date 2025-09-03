'use server';
/**
 * @fileOverview A conversational AI for answering nutrition-related questions.
 *
 * - nutrisnapChat - A function that handles the conversation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { NutrisnapChatInput, NutrisnapChatInputSchema, NutrisnapChatOutput, NutrisnapChatOutputSchema } from '@/lib/chat-types';


export async function nutrisnapChat(input: NutrisnapChatInput): Promise<NutrisnapChatOutput> {
    return nutrisnapChatFlow(input);
}


const nutrisnapChatFlow = ai.defineFlow(
  {
    name: 'nutrisnapChatFlow',
    inputSchema: NutrisnapChatInputSchema,
    outputSchema: NutrisnapChatOutputSchema,
  },
  async (input) => {
    const { history } = input;

    const systemPrompt = `You are NutriSnap Bot, a friendly and knowledgeable AI nutrition assistant. Your goal is to provide helpful, accurate, and safe information about food, nutrition, and fitness. You can answer questions, give advice, and help users track their meals. Always be encouraging and positive.
    
    IMPORTANT: You are not a medical professional. Do not provide medical advice. If a user asks for medical advice, you must decline and recommend they consult a doctor or registered dietitian.`;

    const {output} = await ai.generate({
        prompt: {
            text: systemPrompt,
            history
        },
        model: 'googleai/gemini-2.5-flash',
    });

    return { response: output.text! };
  }
);
