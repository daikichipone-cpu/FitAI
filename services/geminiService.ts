import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PersonaType, AIResponse } from '../types';

const getSystemInstruction = (persona: PersonaType): string => {
  const base = `あなたはプロフェッショナルなAIパーソナルトレーナーです。
  ユーザーは「初心者」で、環境は「24時間利用可能なジム」です。
  以下のペルソナ（性格・指導方針）になりきって、トレーニングメニューとアドバイスを作成してください。`;

  switch (persona) {
    case PersonaType.FatBurn:
      return `${base}
      【ペルソナA: ダイエット重視モデル (Fat Burn Focus)】
      - 特徴: 消費カロリーを最大化するメニュー構成。インターバル短め、有酸素運動やサーキットトレーニングを優先。
      - 食事への反応: 「食べたい物」が高カロリーな場合、それを燃焼するための追加メニューを提案したり、前後の食事調整を厳しめにアドバイスする。
      - 口調: 励まし上手で、少しスパルタ。「そのラーメンのために、あと1セット頑張りましょう！」`;
    
    case PersonaType.Hypertrophy:
      return `${base}
      【ペルソナB: 筋力アップモデル (Hypertrophy Focus)】
      - 特徴: 筋肥大を狙った高負荷・低回数〜中回数のメニュー。BIG3（スクワット、ベンチプレス、デッドリフト）などのコンパウンド種目を優先。休憩時間は長め。
      - 食事への反応: 「食べたい物」がタンパク質豊富なら褒める。ジャンクフードなら「バルクアップ（増量）の燃料にしよう」とポジティブに変換。
      - 口調: 体育会系で熱血。「筋肉が喜ぶ食事ですね！重量を上げましょう！」`;

    case PersonaType.Wellness:
      return `${base}
      【ペルソナC: 平均的なモデル (Wellness Balance)】
      - 特徴: 健康維持、姿勢改善、適度な筋力向上を目指す。無理のない強度で、ストレッチや機能改善も取り入れる。
      - 食事への反応: バランス重視。「食べたい物」を許容しつつ、野菜の追加などを優しく提案。
      - 口調: 親切で丁寧なトレーナー。「無理せず、楽しく体を動かしましょう。」`;
    
    default:
      return base;
  }
};

export const generateTrainerPlan = async (user: UserProfile, persona: PersonaType): Promise<AIResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key definition is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    対象ユーザー情報:
    - 性別: ${user.gender}
    - 年齢: ${user.age}歳
    - 身長: ${user.height}cm
    - 体重: ${user.weight}kg
    - 今日食べたい物: ${user.cravings}
    - 今の気分: ${user.mood}

    このユーザーに最適な「本日のトレーニングメニュー」と「アドバイス」を作成してください。
  `;

  // Define the JSON schema using the new Type enum from @google/genai
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      trainerMessage: {
        type: Type.STRING,
        description: "トレーナーからのひとこと。ペルソナの口調を反映すること。",
      },
      menuList: {
        type: Type.ARRAY,
        description: "本日のトレーニングメニューのリスト",
        items: {
          type: Type.OBJECT,
          properties: {
            exerciseName: { type: Type.STRING, description: "種目名" },
            details: { type: Type.STRING, description: "セット数 / 回数 / 休憩時間" },
            reason: { type: Type.STRING, description: "ポイント（なぜこの種目なのか）" },
          },
          required: ["exerciseName", "details", "reason"],
        },
      },
      dietAndMentalAdvice: {
        type: Type.STRING,
        description: "「今日食べたい物」に対するフィードバックと、トレーニング後のケア方法、メンタルアドバイス。",
      },
    },
    required: ["trainerMessage", "menuList", "dietAndMentalAdvice"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(persona),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Creativity balance
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Empty response from AI");
    }
    
    return JSON.parse(jsonText) as AIResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("トレーニングプランの生成に失敗しました。もう一度お試しください。");
  }
};