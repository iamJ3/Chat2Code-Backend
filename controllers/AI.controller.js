import * as ai from "../services/Gemini.services.js";

export const generateResult = async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await ai.generateResult(prompt);
        res.status(200).json({
            message: 'AI generated result successfully!',
            data: result
        });
        res.send(result);
    } catch (error) {
        console.error('Error generating AI result:', error);
        res.status(500).json({
            message: 'Error generating AI result',
            error: error.message
        });
    }
};
