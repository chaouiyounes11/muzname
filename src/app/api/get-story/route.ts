import {NextResponse} from 'next/server';
import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main(obj: {name:string}) {
    const content = `raconte moi l'histoire du prénom ${obj.name}`;
    const completion = await openai.chat.completions.create({
        messages: [{ role: "assistant", content }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
}

export const POST = async(req: Request, res: Response) => {
    const data = await req.json();

    const story = await main(data);

    try {
        return NextResponse.json({ message: 'Story created', story });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating story', error: error });
    }
}
