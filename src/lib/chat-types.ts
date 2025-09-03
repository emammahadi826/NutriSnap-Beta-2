import {z} from 'genkit';

export const NutrisnapChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    })),
  })).describe('The chat history.'),
});
export type NutrisnapChatInput = z.infer<typeof NutrisnapChatInputSchema>;

export const NutrisnapChatOutputSchema = z.object({
  response: z.string().describe('The bot\'s response.'),
});
export type NutrisnapChatOutput = z.infer<typeof NutrisnapChatOutputSchema>;
