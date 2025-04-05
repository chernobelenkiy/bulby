import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { GeneratedIdea } from '@/types/ideas';

// Schemas for agent responses
const mindMapperSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      centralConcept: z.string(), // The main concept or topic
      branches: z.array(z.string()), // Main branches of the mind map
    })
  ),
  reasoning: z.string(),
});

const connectionAnalyzerSchema = z.object({
  analyses: z.array(
    z.object({
      title: z.string(),
      score: z.number().min(1).max(10),
      connections: z.string(), // Identified connections between concepts
      insights: z.string(), // Insights gained from the mind mapping
      applications: z.string(), // Practical applications of the idea
    })
  ),
  reasoning: z.string(),
});

/**
 * Implements the Mind Mapping method for idea generation using Multi-Agent Collaboration:
 * 1. Mind Mapper - creates the basic mind map structure
 * 2. Connection Analyzer - finds insights and applications
 * 
 * Mind mapping visually organizes information by starting with a central concept
 * and branching out with related ideas, helping discover connections and patterns.
 * 
 * @param prompt User's prompt for idea generation
 * @param language Language code for generating ideas (e.g., 'en', 'ru')
 * @returns Top 3 ideas generated using mind mapping principles
 */
export async function generateIdeasUsingMindMappingMethod(
  prompt: string,
  language: string = 'en'
): Promise<GeneratedIdea[]> {
  // Language-specific instructions
  const languageInstruction = language === 'en' 
    ? 'Generate ideas in English.'
    : language === 'ru'
    ? 'Генерируй идеи на русском языке.'
    : 'Generate ideas in English.';
  
  // 1. Mind Mapper agent - creates the basic mind map structure
  const { object: mindMapperResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in using Mind Mapping for creative idea generation.
    Mind Mapping is a technique that visually organizes information around a central concept, with branches
    representing different aspects or categories.
    
    Generate 5 ideas based on the user's prompt, structured as mind maps.
    For each idea, provide:
    1. A descriptive title for the overall idea
    2. A concise description of the idea
    3. The central concept that forms the core of this mind map
    4. 3-5 main branches that would emerge from the central concept in a mind map
    
    Focus on creating a clear structure for each mind map that effectively organizes the key elements of the idea.
    ${languageInstruction}`,
    prompt,
    schema: mindMapperSchema,
  });

  // Only process the top 5 ideas to avoid overwhelming the second agent
  const topIdeas = mindMapperResponse.ideas.slice(0, 5);

  // 2. Connection Analyzer agent - finds connections, insights and applications
  const { object: analyzerResponse } = await generateObject({
    model: openai('gpt-4o'),
    system: `You are an expert in analyzing mind maps to uncover insights and applications.
    Your job is to examine mind map structures and identify connections between concepts,
    extract insights, and suggest practical applications.
    
    For each mind map, provide:
    1. A score from 1-10 reflecting the quality and potential of the idea
    2. Connections - identify how different branches or concepts relate to each other
    3. Insights - summarize key insights that emerge from the mind map
    4. Applications - suggest practical ways to apply or implement the idea
    
    Look for unexpected connections and innovative applications.
    ${languageInstruction}`,
    prompt: `Analyze these mind map structures:
    ${topIdeas.map(idea => 
      `# ${idea.title}:\n${idea.description}\n- Central Concept: ${idea.centralConcept}\n- Branches: ${idea.branches.join(', ')}`
    ).join('\n\n')}`,
    schema: connectionAnalyzerSchema,
  });

  // Combine and process the results
  const finalIdeas: GeneratedIdea[] = topIdeas.map(idea => {
    const analysis = analyzerResponse.analyses.find(
      analysis => analysis.title === idea.title
    );

    return {
      title: idea.title,
      description: idea.description,
      score: analysis?.score || 5,
      dreamerNotes: `Central Concept: ${idea.centralConcept}\n\nInsights: ${analysis?.insights || ''}`,
      realistNotes: `Applications: ${analysis?.applications || ''}\n\nConnections: ${analysis?.connections || ''}`,
      criticNotes: `Main Branches:\n${idea.branches.map((branch, i) => `${i+1}. ${branch}`).join('\n')}`,
    };
  });

  // Sort ideas by score (highest first)
  finalIdeas.sort((a, b) => b.score - a.score);

  // Return top 3 ideas
  return finalIdeas.slice(0, 3);
} 