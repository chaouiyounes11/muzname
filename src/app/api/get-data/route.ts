import {NextResponse} from 'next/server';
import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main({gender, style, length}: {gender: string, style: string, length: number}) {
    const content = `donne moi 10 idées de prénoms musulmans de ${gender} uniquement qui sont ${style} et ${length}`;
    const completion = await openai.chat.completions.create({
        messages: [{ role: "assistant", content }],
        model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
}

export const POST = async(req: Request, res: Response) => {
    const data = await req.json();

    const list = await main(data.infos);

    try {
        return NextResponse.json({ message: 'Sex created', list });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating list names', error: error });
    }
}
