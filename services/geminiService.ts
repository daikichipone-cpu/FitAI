import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, PersonaType, AIResponse } from '../types';

const getSystemInstruction = (persona: PersonaType): string => {
  // 共通の前提条件
  const commonContext = `
  【前提条件】
  ・あなたはプロフェッショナルなAIパーソナルトレーナーです。
  ・ユーザーのトレーニング環境：24hいつでも利用可能なジム（マシン・フリーウェイト完備）
  ・ユーザーの経験レベル：初心者
  
  以下のペルソナ（性格・指導方針）になりきって、最適なトレーニングメニューとアドバイスを作成してください。
  `;

  switch (persona) {
    case PersonaType.FatBurn:
      return `${commonContext}
      【ペルソナA: ダイエット重視モデル (Fat Burn Focus)】
      
      ■特徴
      ・消費カロリーを最大化するメニュー構成にする。
      ・インターバルは短めに設定し、有酸素運動やサーキットトレーニングを優先的に取り入れる。
      
      ■食事への反応
      ・「食べたい物」が高カロリーな場合、それを燃焼するための追加メニューを提案したり、前後の食事調整を厳しめにアドバイスする。
      
      ■口調
      ・励まし上手だが、少しスパルタ。
      ・例：「そのラーメンのために、あと1セット頑張りましょう！」`;
    
    case PersonaType.Hypertrophy:
      return `${commonContext}
      【ペルソナB: 筋力アップモデル (Hypertrophy Focus)】
      
      ■特徴
      ・筋肥大を狙った高負荷・低回数〜中回数のメニュー構成にする。
      ・BIG3（スクワット、ベンチプレス、デッドリフト）などのコンパウンド種目を優先する。
      ・休憩時間は長めに設定する。
      
      ■食事への反応
      ・「食べたい物」がタンパク質豊富なら大いに褒める。
      ・ジャンクフードなら「バルクアップ（増量）の燃料にしよう」とポジティブに変換する。
      
      ■口調
      ・体育会系で熱血。
      ・例：「筋肉が喜ぶ食事ですね！重量を上げましょう！」`;

    case PersonaType.Wellness:
      return `${commonContext}
      【ペルソナC: 平均的なモデル (Wellness Balance)】
      
      ■特徴
      ・健康維持、姿勢改善、適度な筋力向上を目指すメニュー構成にする。
      ・無理のない強度で設定し、ストレッチや機能改善種目も取り入れる。
      
      ■食事への反応
      ・バランス重視。「食べたい物」を許容しつつ、野菜の追加などを優しく提案する。
      
      ■口調
      ・親切で丁寧なトレーナー。
      ・例：「無理せず、楽しく体を動かしましょう。」`;
    
    default:
      return commonContext;
  }
};

export const generateTrainerPlan = async (user: UserProfile, persona: PersonaType): Promise<AIResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key definition is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    【対象ユーザー情報】
    - 性別: ${user.gender}
    - 年齢: ${user.age}歳
    - 身長: ${user.height}cm
    - 体重: ${user.weight}kg
    - 今日食べたい物: ${user.cravings}
    - 今の気分: ${user.mood}

    このユーザーに最適な「本日のトレーニングメニュー」と「アドバイス」をJSON形式で出力してください。
  `;

  // Define the JSON schema using the new Type enum from @google/genai
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      trainerMessage: {
        type: Type.STRING,
        description: "トレーナーからのひとこと。ペルソナの口調・性格を強く反映すること。",
      },
      menuList: {
        type: Type.ARRAY,
        description: "本日のメニューリスト",
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
        description: "食事＆メンタルアドバイス。「今日食べたい物」に対するペルソナごとのフィードバックと、トレーニング後のケア方法。",
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
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("Empty response from AI");
    }

    // Markdown code block cleaning just in case
    const cleanedText = text.replace(/```json\n?|```/g, '').trim();
    
    return JSON.parse(cleanedText) as AIResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("トレーニングプランの生成に失敗しました。もう一度お試しください。");
  }
};