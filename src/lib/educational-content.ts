/**
 * Comprehensive Educational Content Library for Transformer Visualizer
 * ==================================================================
 * 
 * This module contains layered educational content that explains transformer concepts
 * at different levels of detail, with engaging analogies and clear explanations.
 */

// Types for educational content structure
export interface EducationalContent {
  title: string;
  bigPicture: BigPictureContent;
  steps: StepContent[];
  analogies: AnalogiesLibrary;
  misconceptions: MisconceptionsLibrary;
  applications: ApplicationsLibrary;
  progressiveComplexity: ProgressiveContent;
}

export interface BigPictureContent {
  overview: string;
  realWorldExamples: RealWorldExample[];
  whyAttentionMatters: string;
  preAttentionVsAttention: ComparisonContent;
}

export interface StepContent {
  id: string;
  title: string;
  explanations: LeveledExplanations;
  interactiveElements: InteractiveElement[];
  whyThisMatters: ApplicationContext;
  commonErrors: string[];
  analogies: string[];
}

export interface LeveledExplanations {
  beginner: ExplanationContent;
  intermediate: ExplanationContent;
  advanced: ExplanationContent;
}

export interface ExplanationContent {
  overview: string;
  keyPoints: string[];
  visualCues: string[];
  practicalTips: string[];
  mathematics?: string;
}

export interface RealWorldExample {
  domain: string;
  description: string;
  specificUseCase: string;
  impact: string;
}

export interface InteractiveElement {
  type: 'click' | 'hover' | 'drag' | 'toggle' | 'slider';
  description: string;
  learningObjective: string;
  feedbackText: string;
}

export interface ApplicationContext {
  realWorldApplications: string[];
  whatBreaksWithout: string[];
  historicalContext: string;
}

export interface ComparisonContent {
  before: {
    description: string;
    limitations: string[];
    examples: string[];
  };
  after: {
    description: string;
    advantages: string[];
    examples: string[];
  };
}

export interface AnalogiesLibrary {
  library: LibraryAnalogy;
  spotlight: SpotlightAnalogy;
  restaurant: RestaurantAnalogy;
  multipleExperts: MultipleExpertsAnalogy;
  orchestra: OrchestraAnalogy;
  socialNetwork: SocialNetworkAnalogy;
  detective: DetectiveAnalogy;
  gps: GPSAnalogy;
  dj: DJAnalogy;
  memory: MemoryAnalogy;
}

// Analogy interface types
export interface LibraryAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface SpotlightAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface RestaurantAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface MultipleExpertsAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface OrchestraAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface SocialNetworkAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface DetectiveAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface GPSAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface DJAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface MemoryAnalogy {
  title: string;
  overview: string;
  detailedScenarios: DetailedScenario[];
  extensions: string[];
}

export interface DetailedScenario {
  scenario: string;
  description: string;
  mapping: string;
  example: string;
}

export interface MisconceptionsLibrary {
  attentionIsNot: string[];
  commonConfusions: CommonConfusion[];
  technicalClarifications: TechnicalClarification[];
}

export interface CommonConfusion {
  misconception: string;
  reality: string;
  explanation: string;
  analogy?: string;
}

export interface TechnicalClarification {
  term: string;
  wrongInterpretation: string;
  correctInterpretation: string;
  example: string;
}

// Comprehensive Educational Content
export const EDUCATIONAL_CONTENT: EducationalContent = {
  title: "Understanding Transformer Attention: From Intuition to Implementation",
  
  bigPicture: {
    overview: `
      Transformers are like incredibly smart reading comprehension systems. When you read a sentence, 
      your brain automatically understands which words are most important for understanding the meaning. 
      Transformers do the same thing - they learn to pay attention to the most relevant parts of the text 
      to understand and generate language.
    `,
    
    realWorldExamples: [
      {
        domain: "Translation",
        description: "Google Translate understanding which words in one language correspond to words in another",
        specificUseCase: "Translating 'The red car' to 'La voiture rouge' - knowing 'red' modifies 'car' and should be placed after 'voiture' in French",
        impact: "Enables fluent, context-aware translation across 100+ languages"
      },
      {
        domain: "Chatbots",
        description: "ChatGPT understanding the context of your conversation to give relevant responses",
        specificUseCase: "When you ask 'How do I fix it?' the model knows 'it' refers to the problem you mentioned earlier",
        impact: "Creates natural, coherent conversations that maintain context"
      },
      {
        domain: "Code Generation",
        description: "GitHub Copilot understanding the relationship between function names, parameters, and code context",
        specificUseCase: "Suggesting appropriate variable names based on the function's purpose and existing code patterns",
        impact: "Accelerates software development by understanding coding patterns and context"
      },
      {
        domain: "Document Summarization",
        description: "AI systems identifying the most important sentences and concepts in long documents",
        specificUseCase: "Reading a 50-page research paper and highlighting the key findings, methodology, and conclusions",
        impact: "Saves hours of reading time while preserving crucial information"
      },
      {
        domain: "Search Engines",
        description: "Understanding the intent behind search queries and matching with relevant content",
        specificUseCase: "When you search 'apple problems', understanding whether you mean fruit diseases or computer issues based on context",
        impact: "Provides more accurate and contextually relevant search results"
      }
    ],
    
    whyAttentionMatters: `
      Before attention mechanisms, AI models processed text sequentially, like reading word by word without 
      being able to look back or ahead. This made it hard to understand long-range relationships. 

      Attention changed everything by allowing models to look at ALL words simultaneously and decide which 
      ones are most relevant for understanding each position. It's like having perfect photographic memory 
      and being able to instantly recall any relevant information from anywhere in the text.
    `,
    
    preAttentionVsAttention: {
      before: {
        description: "Sequential models (RNNs, LSTMs) processed text one word at a time, like reading through a narrow window",
        limitations: [
          "Could forget important information from earlier in the text",
          "Couldn't process words in parallel - slow training",
          "Struggled with long-range dependencies (connecting ideas far apart)",
          "Had difficulty with tasks requiring global understanding"
        ],
        examples: [
          "In 'The cat, which was sitting on the mat that I bought yesterday, was sleeping', models would often forget 'cat' when processing 'was sleeping'",
          "Translation quality degraded significantly for long sentences",
          "Couldn't efficiently capture relationships like subject-verb agreement across long phrases"
        ]
      },
      after: {
        description: "Attention-based models can look at all words simultaneously and decide relevance dynamically",
        advantages: [
          "Perfect memory - can access any previous information instantly",
          "Parallel processing - much faster training and inference",
          "Captures long-range dependencies naturally",
          "Provides interpretable attention weights showing model reasoning"
        ],
        examples: [
          "Can connect 'The cat' with 'was sleeping' even with long intervening phrases",
          "Handles book-length documents while maintaining coherence",
          "Successfully performs complex reasoning tasks requiring global document understanding"
        ]
      }
    }
  },

  steps: [
    {
      id: "embed",
      title: "Token Embeddings: Converting Words to Mathematical Vectors",
      explanations: {
        beginner: {
          overview: "Every word needs to become numbers so the computer can work with them. Think of it like giving each word a unique fingerprint made of numbers.",
          keyPoints: [
            "Words become vectors (lists of numbers)",
            "Similar words get similar number patterns",
            "Position information gets added so word order matters",
            "These numbers capture the 'meaning' of each word"
          ],
          visualCues: [
            "Each token chip represents one word",
            "The numbers in the table are the word's 'fingerprint'",
            "Similar words would have similar patterns of numbers",
            "Position encodings add location information"
          ],
          practicalTips: [
            "Try different sentences to see how word embeddings change",
            "Toggle position encodings to see how word order affects the numbers",
            "Notice how the same word gets the same embedding regardless of position"
          ]
        },
        intermediate: {
          overview: "Token embeddings map discrete words into continuous vector spaces where semantic similarity translates to spatial proximity. Position encodings add crucial sequence information.",
          keyPoints: [
            "Embeddings transform sparse one-hot vectors into dense, meaningful representations",
            "Vector dimensions capture different aspects of meaning (syntax, semantics, etc.)",
            "Positional encodings use sinusoidal functions to encode sequence order",
            "The combination provides both content and context information"
          ],
          visualCues: [
            "Each dimension (column) in the embedding table captures different linguistic features",
            "Values close to zero indicate weak association with that feature",
            "Higher absolute values indicate stronger feature association",
            "Positional patterns show up as consistent mathematical relationships"
          ],
          practicalTips: [
            "Compare embeddings of synonyms to see similarity patterns",
            "Observe how function words (the, of, in) differ from content words",
            "Toggle positional encodings to see their mathematical contribution",
            "Notice how embedding quality affects all downstream processing"
          ]
        },
        advanced: {
          overview: "Embeddings implement a learnable lookup table E ∈ ℝ^(V×d_model) where V is vocabulary size. Positional encodings PE(pos,2i) = sin(pos/10000^(2i/d_model)) add sequence information without learnable parameters.",
          keyPoints: [
            "Token embeddings are learned representations optimized for the specific task",
            "Positional encodings use fixed sinusoidal patterns to maintain translation invariance",
            "The embedding space typically has 256-1024 dimensions in production models",
            "Subword tokenization (BPE, SentencePiece) handles out-of-vocabulary words"
          ],
          visualCues: [
            "Matrix dimensions directly show vocabulary size vs. model dimension trade-offs",
            "Embedding magnitudes reflect learning dynamics and initialization schemes",
            "Positional encoding patterns show clear sinusoidal structure",
            "Combined representations show both semantic and positional information"
          ],
          practicalTips: [
            "Experiment with different initialization schemes for embeddings",
            "Understand how positional encoding frequency affects position resolution",
            "Consider learned vs. fixed positional encodings for different use cases",
            "Analyze embedding clustering to understand learned semantic relationships"
          ],
          mathematics: "X[i] = Embedding[tokens[i]] + PE[i] where PE[pos,2i] = sin(pos/10000^(2i/d_model)), PE[pos,2i+1] = cos(pos/10000^(2i/d_model))"
        }
      },
      interactiveElements: [
        {
          type: 'click',
          description: "Click different tokens to see their embedding vectors",
          learningObjective: "Understand that each word has a unique numerical representation",
          feedbackText: "Notice how similar words have similar embedding patterns!"
        },
        {
          type: 'toggle',
          description: "Toggle positional encodings on/off",
          learningObjective: "See how position information affects the representation",
          feedbackText: "Position encodings add location information - crucial for understanding word order!"
        }
      ],
      whyThisMatters: {
        realWorldApplications: [
          "Search engines use embeddings to understand query intent",
          "Recommendation systems find similar products using embedding similarity",
          "Translation systems map words across languages in embedding space"
        ],
        whatBreaksWithout: [
          "Model cannot understand word meaning - treats all words as equally different",
          "No understanding of semantic similarity (cat vs. dog vs. completely unrelated words)",
          "Cannot handle word order or position-dependent relationships"
        ],
        historicalContext: "Word embeddings revolutionized NLP by moving from sparse one-hot vectors to dense, meaningful representations. Word2Vec and GloVe were early breakthroughs before learned embeddings in neural models."
      },
      commonErrors: [
        "Thinking embeddings capture only semantic meaning (they also capture syntax, frequency, etc.)",
        "Assuming similar embeddings always mean similar meanings (context matters)",
        "Forgetting that embeddings are learned and task-specific"
      ],
      analogies: [
        "Like creating a unique DNA code for each word that captures its characteristics",
        "Similar to GPS coordinates - words with similar meanings are 'located' close together",
        "Like a detailed profile for each word containing all its important traits"
      ]
    },

    {
      id: "qkv",
      title: "Query, Key, Value: Setting Up the Attention Mechanism",
      explanations: {
        beginner: {
          overview: "Each word gets three different 'roles' in the attention game: Query (what am I looking for?), Key (what do I have to offer?), and Value (what information do I actually contain?).",
          keyPoints: [
            "Query: The question this word is asking",
            "Key: The label describing what this word offers",
            "Value: The actual information this word contains",
            "Same word plays all three roles simultaneously"
          ],
          visualCues: [
            "Q, K, V tables show the same tokens with different 'roles'",
            "Numbers look different because each role uses different transformations",
            "Each row represents one token in one of its three roles",
            "The values come from multiplying embeddings by learned weight matrices"
          ],
          practicalTips: [
            "Think of Query as 'what I need to know'",
            "Think of Key as 'what I can tell you about'",
            "Think of Value as 'the actual information I have'",
            "The same word can be asking questions while also providing answers"
          ]
        },
        intermediate: {
          overview: "Linear transformations convert embeddings into query, key, and value representations that serve different functions in attention computation. This separation enables flexible information routing.",
          keyPoints: [
            "Three separate linear transformations (WQ, WK, WV) create specialized representations",
            "Query vectors represent information needs or search patterns",
            "Key vectors represent the topics or categories of information available",
            "Value vectors contain the actual information to be propagated",
            "Dimensionality is often reduced (d_model → d_k) for computational efficiency"
          ],
          visualCues: [
            "Weight matrices transform the same input differently for each role",
            "Q and K dimensions must match for dot-product compatibility",
            "V dimensions can differ but typically match d_k",
            "Different heads use different weight matrices for specialization"
          ],
          practicalTips: [
            "Observe how the same token's Q, K, V representations differ",
            "Consider what types of relationships each head might capture",
            "Think about how dimensionality reduction affects representational capacity",
            "Analyze patterns in the learned weight matrices"
          ]
        },
        advanced: {
          overview: "The QKV transformation implements a learned content-based addressing scheme where Q·K^T computes address relevance and V provides addressed content. This enables differentiable memory access patterns.",
          keyPoints: [
            "Learned transformations WQ, WK, WV ∈ ℝ^(d_model × d_k) specialize embedding information",
            "Query-key dot products implement cosine similarity in the transformed space",
            "Multi-head attention uses different transformation matrices for parallel specialization",
            "Value dimensionality can differ from d_k to control information bottlenecks"
          ],
          visualCues: [
            "Matrix multiplications show how linear transformations reshape information",
            "Different weight initialization schemes affect learning dynamics",
            "Gradient flow patterns show which transformations are most actively learning",
            "Head specialization emerges from different random initializations"
          ],
          practicalTips: [
            "Analyze weight matrix singular values to understand transformation effects",
            "Monitor gradient norms to detect vanishing/exploding gradients",
            "Experiment with different d_k values to balance capacity and efficiency",
            "Study attention head specialization patterns in trained models"
          ],
          mathematics: "Q = XW_Q, K = XW_K, V = XW_V where W_Q, W_K, W_V ∈ ℝ^(d_model × d_k)"
        }
      },
      interactiveElements: [
        {
          type: 'click',
          description: "Click tokens to see their Q, K, V representations",
          learningObjective: "Understand how the same token has different representations for different roles",
          feedbackText: "See how the same word creates different vectors for asking vs. answering vs. containing information!"
        },
        {
          type: 'hover',
          description: "Hover over different heads to see specialized Q, K, V patterns",
          learningObjective: "Observe how different heads specialize in different transformation patterns",
          feedbackText: "Each head learns different ways to transform the same input - enabling parallel specialization!"
        }
      ],
      whyThisMatters: {
        realWorldApplications: [
          "Database systems use similar key-value lookups for information retrieval",
          "Search engines match queries (Q) against document keys (K) to retrieve content (V)",
          "Memory systems in neural architectures use QKV patterns for content-based addressing"
        ],
        whatBreaksWithout: [
          "No way to selectively attend to relevant information",
          "Cannot distinguish between 'what I need' and 'what I have'",
          "Information retrieval becomes random rather than content-based"
        ],
        historicalContext: "The QKV formulation was inspired by information retrieval systems and associative memory models. It provides a differentiable way to implement content-based addressing in neural networks."
      },
      commonErrors: [
        "Thinking Q, K, V are completely different information (they're different views of the same token)",
        "Assuming larger dimensions are always better (diminishing returns and computational costs)",
        "Not understanding that the transformations are learned, not hand-crafted"
      ],
      analogies: [
        "Library system: Query is your research question, Keys are book catalog entries, Values are the actual books",
        "Restaurant: Query is what you want to eat, Keys are menu descriptions, Values are the actual dishes",
        "Social network: Query is what you're interested in, Keys are profile descriptions, Values are the actual posts/content"
      ]
    },

    {
      id: "scores",
      title: "Attention Scores: Computing Relevance Between Words",
      explanations: {
        beginner: {
          overview: "Now we calculate how much each word should pay attention to every other word. It's like measuring how relevant each word is to understanding another word.",
          keyPoints: [
            "Each word's Query is compared with every word's Key",
            "Higher scores mean more relevance/similarity",
            "Creates a square matrix showing all pairwise relationships",
            "Raw scores will be converted to percentages later"
          ],
          visualCues: [
            "Blue cells show negative scores (less relevant)",
            "Red cells show positive scores (more relevant)",
            "Each row shows one token's attention to all other tokens",
            "The highlighted row shows the selected token's attention pattern"
          ],
          practicalTips: [
            "Look for patterns - which types of words attend to each other?",
            "Notice symmetries or asymmetries in the attention matrix",
            "Try different sentences to see how attention patterns change",
            "Click different tokens to see their unique attention patterns"
          ]
        },
        intermediate: {
          overview: "Attention scores implement scaled dot-product similarity between query and key vectors, measuring semantic compatibility for information routing decisions.",
          keyPoints: [
            "Dot product Q·K^T measures vector similarity in the learned space",
            "Scaling by 1/√d_k prevents extremely large scores that would saturate softmax",
            "Each matrix element represents relevance between query token i and key token j",
            "Score patterns reflect learned linguistic relationships and dependencies"
          ],
          visualCues: [
            "Matrix symmetry depends on whether queries and keys capture similar relationships",
            "Score magnitudes indicate confidence in relevance judgments",
            "Color intensity corresponds to absolute score values",
            "Patterns often emerge along syntactic or semantic lines"
          ],
          practicalTips: [
            "Analyze score patterns to understand learned linguistic relationships",
            "Compare attention patterns across different sentence types",
            "Observe how scaling affects the dynamic range of attention weights",
            "Look for consistent patterns that indicate systematic linguistic knowledge"
          ]
        },
        advanced: {
          overview: "Attention scores compute scaled dot-product similarity: Attention(Q,K,V) = softmax(QK^T/√d_k)V. The scaling factor prevents gradient vanishing in high-dimensional spaces.",
          keyPoints: [
            "Dot products implement cosine similarity when vectors are normalized",
            "Temperature scaling (1/√d_k) controls attention sharpness",
            "Score computation is embarrassingly parallel across sequence positions",
            "Attention patterns encode inductive biases learned from training data"
          ],
          visualCues: [
            "Score distributions show the learned temperature and concentration effects",
            "Spectral properties of attention matrices reveal structural patterns",
            "Attention entropy indicates how focused vs. distributed the patterns are",
            "Cross-head attention correlations show specialization patterns"
          ],
          practicalTips: [
            "Monitor attention entropy to detect over-concentration or under-specification",
            "Analyze eigenvalues of attention matrices for stability properties",
            "Experiment with different scaling factors for temperature control",
            "Study attention pattern evolution during training"
          ],
          mathematics: "Attention_scores[i,j] = (Q[i] · K[j]) / √d_k"
        }
      },
      interactiveElements: [
        {
          type: 'click',
          description: "Click matrix cells to see specific query-key interactions",
          learningObjective: "Understand how specific word pairs relate to each other",
          feedbackText: "This score shows how relevant the key word is to the query word's information needs!"
        },
        {
          type: 'hover',
          description: "Hover over rows to see attention patterns for different query tokens",
          learningObjective: "Observe how different words have different attention patterns",
          feedbackText: "Each word has its own unique pattern of which other words it finds relevant!"
        }
      ],
      whyThisMatters: {
        realWorldApplications: [
          "Search engines compute relevance scores between queries and documents",
          "Recommendation systems calculate similarity between user preferences and items",
          "Machine translation systems identify corresponding words across languages"
        ],
        whatBreaksWithout: [
          "All words would be treated as equally relevant - no selective attention",
          "Model cannot focus on important information while ignoring irrelevant details",
          "No way to capture long-range dependencies or syntactic relationships"
        ],
        historicalContext: "Scaled dot-product attention was chosen for its computational efficiency and theoretical properties. Alternative attention mechanisms exist but are less commonly used due to computational costs."
      },
      commonErrors: [
        "Thinking high scores always mean positive relationships (they just mean high relevance)",
        "Assuming symmetric attention patterns (A attending to B doesn't mean B attends equally to A)",
        "Not understanding that raw scores need normalization before use"
      ],
      analogies: [
        "Like rating how useful each book is for answering your specific research question",
        "Similar to measuring how well each person's expertise matches your current need",
        "Like calculating compatibility scores in a dating app - higher scores indicate better matches"
      ]
    },

    {
      id: "softmax",
      title: "Softmax Normalization: Converting Scores to Attention Weights",
      explanations: {
        beginner: {
          overview: "Raw scores are converted into percentages that add up to 100%. This creates a 'budget' of attention that gets distributed across all words.",
          keyPoints: [
            "Softmax turns any numbers into probabilities (0-100%, sum = 100%)",
            "Higher scores become higher percentages",
            "Each row sums to exactly 100%",
            "These percentages show how to distribute attention"
          ],
          visualCues: [
            "Colors now represent attention percentages, not raw scores",
            "Darker colors mean higher attention percentages",
            "Each cell shows percentage (0-100%)",
            "Row sums always equal 100%"
          ],
          practicalTips: [
            "Check that each row sums to 100%",
            "Notice how the highest score becomes the highest percentage",
            "See how relative differences become more pronounced",
            "Observe which words get most of the 'attention budget'"
          ]
        },
        intermediate: {
          overview: "Softmax normalization converts raw compatibility scores into probability distributions, ensuring attention weights are interpretable and sum to one for each query position.",
          keyPoints: [
            "Softmax: exp(x_i) / Σ exp(x_j) creates valid probability distributions",
            "Temperature parameter controls sharpness of attention distributions",
            "Masking sets certain positions to -∞ before softmax for causal attention",
            "Resulting weights represent conditional probabilities for information routing"
          ],
          visualCues: [
            "Probability distributions show where model attention is concentrated",
            "Sharp distributions indicate confident attention decisions",
            "Flat distributions suggest uncertain or distributed attention",
            "Masked positions show zero probability (enforcing causal constraints)"
          ],
          practicalTips: [
            "Monitor attention entropy to gauge concentration vs. distribution",
            "Observe how masking affects the shape of attention distributions",
            "Compare attention sharpness across different heads and layers",
            "Analyze attention weight variance to detect potential issues"
          ]
        },
        advanced: {
          overview: "Softmax implements differentiable winner-take-all competition while maintaining gradient flow. The temperature parameter β in softmax(x/β) controls the exploration-exploitation trade-off in attention.",
          keyPoints: [
            "Softmax gradients exhibit winner-take-all dynamics with competitive learning",
            "Numerical stability requires subtracting max before exponentiation",
            "Causal masking adds -∞ to future positions before softmax computation",
            "Attention dropout can be applied to attention weights for regularization"
          ],
          visualCues: [
            "Gradient flow patterns show how softmax affects backpropagation",
            "Attention distribution entropy indicates model confidence levels",
            "Masking patterns enforce architectural constraints (causal, local, etc.)",
            "Temperature effects show exploration vs. exploitation balance"
          ],
          practicalTips: [
            "Monitor softmax temperature effects on attention sharpness",
            "Implement attention dropout for regularization in large models",
            "Use numerical stability techniques for softmax computation",
            "Analyze attention pattern diversity across heads and layers"
          ],
          mathematics: "Attention_weights[i,j] = exp(scores[i,j]) / Σ_k exp(scores[i,k])"
        }
      },
      interactiveElements: [
        {
          type: 'click',
          description: "Click different rows to see how attention budgets are distributed",
          learningObjective: "Understand how each word allocates its 100% attention budget",
          feedbackText: "This row shows how this word distributes its attention across all other words - notice it sums to 100%!"
        },
        {
          type: 'toggle',
          description: "Toggle causal masking to see how future positions are blocked",
          learningObjective: "See how masking affects attention weight distributions",
          feedbackText: "Causal masking prevents looking ahead - see how attention gets redistributed to available positions!"
        }
      ],
      whyThisMatters: {
        realWorldApplications: [
          "Resource allocation systems use similar normalization for budget distribution",
          "Probability theory applications in machine learning and statistics",
          "Decision-making systems that need to allocate attention or resources"
        ],
        whatBreaksWithout: [
          "Attention weights could be negative or sum to arbitrary values",
          "No principled way to combine information from multiple sources",
          "Unstable training dynamics due to unbounded attention weights"
        ],
        historicalContext: "Softmax was adapted from statistical mechanics (Boltzmann distribution) and became standard in neural networks for converting logits to probabilities."
      },
      commonErrors: [
        "Thinking softmax changes the ranking (it preserves order, just normalizes)",
        "Not understanding that masking happens before softmax, not after",
        "Assuming equal attention weights mean the model is confused (could be appropriate for the context)"
      ],
      analogies: [
        "Like converting raw preference scores into a budget - you have exactly $100 to spend across all options",
        "Similar to vote percentages in an election - all votes must sum to 100%",
        "Like adjusting camera focus - you have a fixed amount of 'focus power' to distribute"
      ]
    },

    {
      id: "weighted",
      title: "Weighted Sum: Gathering and Combining Information",
      explanations: {
        beginner: {
          overview: "Now we use the attention percentages to create a smart summary. Words that got more attention contribute more to the final result.",
          keyPoints: [
            "Each Value vector is multiplied by its attention percentage",
            "All the weighted Values are added together",
            "High attention words contribute more to the final representation",
            "Creates a context-aware summary for each position"
          ],
          visualCues: [
            "The output vector shows the combined information",
            "Numbers reflect the weighted combination of all Value vectors",
            "Higher attention weights mean bigger contributions",
            "Each token gets its own context-aware representation"
          ],
          practicalTips: [
            "See how attention weights affect the final output",
            "Notice which tokens contribute most to the representation",
            "Try changing the selected token to see different weighted combinations",
            "Observe how the output captures relevant contextual information"
          ]
        },
        intermediate: {
          overview: "The weighted sum operation implements information aggregation where attention weights control the contribution of each value vector to the final representation.",
          keyPoints: [
            "Linear combination: output[i] = Σ_j attention[i,j] × value[j]",
            "Attention weights act as gates controlling information flow",
            "Result contains information from all positions, weighted by relevance",
            "Creates position-specific contextual representations"
          ],
          visualCues: [
            "Output magnitude reflects the weighted contribution patterns",
            "Attention weight distributions directly influence output characteristics",
            "Context mixing can be observed through output vector changes",
            "Different attention patterns produce different contextual representations"
          ],
          practicalTips: [
            "Analyze how different attention patterns affect output representations",
            "Compare outputs across different tokens to see contextual effects",
            "Observe the relationship between attention entropy and output diversity",
            "Study how attention weights modulate information propagation"
          ]
        },
        advanced: {
          overview: "The weighted sum implements differentiable content-based memory access, where attention weights determine which memories (values) are retrieved and combined for each query.",
          keyPoints: [
            "Implements soft attention: all values contribute with learned weights",
            "Gradient flow enables end-to-end learning of attention patterns",
            "Memory complexity scales quadratically with sequence length",
            "Information bottleneck depends on value dimension and attention concentration"
          ],
          visualCues: [
            "Gradient magnitudes show which attention patterns are actively learning",
            "Output variance indicates the diversity of retrieved information",
            "Attention sparsity patterns affect computational and memory efficiency",
            "Cross-positional information mixing creates contextual representations"
          ],
          practicalTips: [
            "Monitor gradient flow through attention weights for training stability",
            "Analyze attention sparsity for potential efficiency optimizations",
            "Study the trade-off between attention concentration and information diversity",
            "Experiment with attention regularization techniques"
          ],
          mathematics: "Output[i] = Σ_j Attention_weights[i,j] × Value[j]"
        }
      },
      interactiveElements: [
        {
          type: 'click',
          description: "Click different tokens to see their weighted sum results",
          learningObjective: "Understand how attention weights affect information combination",
          feedbackText: "This output shows how attention weights combine information from all tokens for this position!"
        },
        {
          type: 'slider',
          description: "Visualize how changing attention weights affects the output",
          learningObjective: "See direct relationship between attention and output",
          feedbackText: "Higher attention weights mean this token contributes more to the final representation!"
        }
      ],
      whyThisMatters: {
        realWorldApplications: [
          "Weighted voting systems where different votes have different importance",
          "Image processing where attention determines which image regions to focus on",
          "Financial analysis where different factors are weighted based on their relevance"
        ],
        whatBreaksWithout: [
          "No way to selectively use relevant information while ignoring irrelevant details",
          "All information would contribute equally regardless of relevance",
          "Cannot create context-specific representations"
        ],
        historicalContext: "Weighted combinations are fundamental in many fields. Attention made them learnable and dynamic, allowing models to adapt their information gathering strategies."
      },
      commonErrors: [
        "Thinking the output only comes from the highest-attention token (it's a weighted combination of ALL tokens)",
        "Not realizing that even low attention weights still contribute to the output",
        "Assuming the output dimensions are the same as input (they depend on value dimensions)"
      ],
      analogies: [
        "Like making a smoothie where attention weights determine how much of each ingredient to include",
        "Similar to writing a research paper where you give more space to more relevant sources",
        "Like a recipe where attention determines the proportions of each ingredient"
      ]
    },

    {
      id: "mh",
      title: "Multi-Head Attention: Parallel Processing and Integration",
      explanations: {
        beginner: {
          overview: "Instead of having just one attention pattern, we have multiple 'heads' working in parallel. Each head can focus on different types of relationships, then we combine their insights.",
          keyPoints: [
            "Multiple attention heads work simultaneously",
            "Each head can specialize in different types of relationships",
            "Outputs from all heads are combined (concatenated)",
            "A final transformation mixes information from all heads"
          ],
          visualCues: [
            "Switch between head tabs to see different attention patterns",
            "Each head shows different attention patterns for the same sentence",
            "The final step shows all heads combined together",
            "Different heads often focus on different aspects of language"
          ],
          practicalTips: [
            "Compare attention patterns across different heads",
            "Look for heads that seem to focus on specific relationships",
            "See how the final output combines insights from all heads",
            "Notice that heads can have complementary attention patterns"
          ]
        },
        intermediate: {
          overview: "Multi-head attention enables parallel computation of different attention patterns, allowing the model to capture various types of relationships simultaneously within the same layer.",
          keyPoints: [
            "H heads compute attention in parallel with different learned parameters",
            "Head outputs are concatenated: [head₁; head₂; ...; headₕ]",
            "Output projection W_O mixes information across heads",
            "Different heads often specialize in different linguistic phenomena"
          ],
          visualCues: [
            "Head diversity can be observed through attention pattern differences",
            "Concatenation increases the effective dimension of representations",
            "Output projection creates dependencies between head outputs",
            "Specialization patterns emerge during training"
          ],
          practicalTips: [
            "Analyze attention pattern diversity across heads for the same input",
            "Study head specialization patterns in different domains",
            "Monitor head utilization to detect redundant or underused heads",
            "Experiment with different numbers of heads for capacity/efficiency trade-offs"
          ]
        },
        advanced: {
          overview: "Multi-head attention implements parallel subspace attention where each head attends in a learned linear subspace of the representation space, enabling capture of multiple simultaneous relationships.",
          keyPoints: [
            "Each head operates in d_k-dimensional subspaces of the full d_model space",
            "Parallel computation enables efficient GPU utilization",
            "Head concatenation preserves information from all subspaces",
            "Output projection W_O ∈ ℝ^(H×d_k × d_model) enables cross-head communication"
          ],
          visualCues: [
            "Subspace projections create specialized attention computations",
            "Parallelization patterns optimize hardware utilization",
            "Concatenation preserves distinct head contributions",
            "Output projection enables learned head combination strategies"
          ],
          practicalTips: [
            "Profile parallel attention computation for hardware optimization",
            "Analyze head pruning strategies for model compression",
            "Study attention head interpretability and specialization",
            "Experiment with head fusion techniques for efficiency"
          ],
          mathematics: "MultiHead(Q,K,V) = Concat(head₁,...,headₕ)W_O where headᵢ = Attention(QW_Q^i, KW_K^i, VW_V^i)"
        }
      },
      interactiveElements: [
        {
          type: 'click',
          description: "Switch between head tabs to compare attention patterns",
          learningObjective: "Observe how different heads capture different relationships",
          feedbackText: "Each head learns to focus on different types of word relationships - like syntax, semantics, or coreference!"
        },
        {
          type: 'hover',
          description: "View the concatenated and projected final output",
          learningObjective: "Understand how multiple heads are combined into final representations",
          feedbackText: "The final output combines insights from all heads through concatenation and projection!"
        }
      ],
      whyThisMatters: {
        realWorldApplications: [
          "Ensemble methods in machine learning use similar parallel processing",
          "Multi-perspective analysis systems that consider different viewpoints simultaneously",
          "Parallel processing systems that divide complex tasks into specialized subtasks"
        ],
        whatBreaksWithout: [
          "Limited to capturing only one type of relationship at a time",
          "Cannot handle the complexity of natural language with single attention pattern",
          "Reduced model capacity and representational power"
        ],
        historicalContext: "Multi-head attention was inspired by ensemble methods and the observation that different attention heads naturally specialize in different linguistic phenomena."
      },
      commonErrors: [
        "Thinking heads are completely independent (the output projection creates interactions)",
        "Assuming more heads are always better (diminishing returns and computational costs)",
        "Not understanding that heads can learn similar patterns (redundancy is possible)"
      ],
      analogies: [
        "Like having multiple expert consultants analyze the same problem from different angles",
        "Similar to a multi-instrument orchestra where each section contributes different musical elements",
        "Like a team of specialists where each person focuses on their expertise area"
      ]
    }
  ],

  analogies: {
    library: {
      title: "The Library Research Analogy",
      overview: "Understanding attention through the lens of library research",
      detailedScenarios: [
        {
          scenario: "Research Question (Query)",
          description: "You walk into a library with a specific research question: 'How do transformers work?'",
          mapping: "Query vector represents what information you're seeking",
          example: "Your question acts as a search template that can be matched against available resources"
        },
        {
          scenario: "Book Catalog (Keys)",
          description: "Each book has a catalog entry describing its contents: 'Machine Learning', 'Neural Networks', 'History of Rome'",
          mapping: "Key vectors represent what information each token can provide",
          example: "Books about ML will have high similarity to your transformer question"
        },
        {
          scenario: "Actual Books (Values)",
          description: "The books themselves contain the actual information you need",
          mapping: "Value vectors contain the actual information to be retrieved",
          example: "The ML book contains detailed explanations about transformers"
        },
        {
          scenario: "Relevance Scoring",
          description: "You evaluate how relevant each book is to your question",
          mapping: "Attention scores measure query-key similarity",
          example: "ML book gets high score, Roman history gets low score"
        },
        {
          scenario: "Reading Time Allocation",
          description: "You spend 70% of your time on the ML book, 20% on AI book, 10% skimming others",
          mapping: "Attention weights determine information contribution",
          example: "High-relevance books contribute more to your final understanding"
        }
      ],
      extensions: [
        "Multiple research questions (multi-head) = asking different librarians specialized in different topics",
        "Causal masking = only being able to check books published before a certain date",
        "Position encoding = book location in the library affects accessibility"
      ]
    },

    spotlight: {
      title: "The Spotlight Analogy",
      overview: "Attention as a dynamic spotlight that can focus on different parts of the input",
      detailedScenarios: [
        {
          scenario: "Theater Performance",
          description: "A spotlight operator controls where the audience's attention goes during a play",
          mapping: "Attention mechanism controls which tokens receive focus",
          example: "When a character speaks, spotlight focuses on them, dimming other actors"
        },
        {
          scenario: "Adjustable Brightness",
          description: "The spotlight can be bright (focused) or dim (distributed)",
          mapping: "Attention sharpness controlled by softmax temperature",
          example: "Sharp attention = bright spotlight on one actor; soft attention = dimmer light on multiple actors"
        },
        {
          scenario: "Multiple Spotlights",
          description: "Different colored spotlights can focus on different aspects simultaneously",
          mapping: "Multi-head attention with each head as a different spotlight",
          example: "Red spotlight on main character, blue on background action, green on props"
        }
      ],
      extensions: [
        "Spotlight operator training = learning attention patterns during model training",
        "Audience understanding = weighted combination of illuminated information",
        "Stage constraints = attention masking (some positions cannot be illuminated)"
      ]
    },

    restaurant: {
      title: "The Restaurant Menu Analogy",
      overview: "Token selection and attention through restaurant ordering",
      detailedScenarios: [
        {
          scenario: "Customer Preferences (Query)",
          description: "You arrive hungry with specific preferences: vegetarian, spicy, not too expensive",
          mapping: "Query represents what you're looking for",
          example: "Your preferences guide what menu items you'll pay attention to"
        },
        {
          scenario: "Menu Descriptions (Keys)",
          description: "Each dish has a description: 'Spicy Vegetarian Curry - $12', 'Beef Steak - $25'",
          mapping: "Keys describe what each option offers",
          example: "Menu descriptions help you identify relevant options"
        },
        {
          scenario: "Actual Dishes (Values)",
          description: "The real food that will be prepared and served",
          mapping: "Values contain the actual content",
          example: "The curry dish itself, not just its description"
        },
        {
          scenario: "Decision Making",
          description: "You rate each menu item based on how well it matches your preferences",
          mapping: "Attention scores measure preference-description match",
          example: "Vegetarian curry gets high score, beef steak gets low score"
        },
        {
          scenario: "Order Selection",
          description: "You decide to order 60% curry, 30% naan, 10% rice (sharing or tasting portions)",
          mapping: "Attention weights determine final selection",
          example: "Your meal becomes a weighted combination of chosen dishes"
        }
      ],
      extensions: [
        "Multiple diners (multi-head) = different people with different preferences ordering together",
        "Dietary restrictions (masking) = certain menu items are unavailable",
        "Table location (position) = seating affects what options you can see/access"
      ]
    },

    multipleExperts: {
      title: "The Multiple Experts Analogy",
      overview: "Multi-head attention as consultation with different domain experts",
      detailedScenarios: [
        {
          scenario: "Medical Consultation",
          description: "You have symptoms and consult multiple specialists: cardiologist, neurologist, general practitioner",
          mapping: "Each attention head is a different specialist",
          example: "Heart doctor focuses on cardiovascular aspects, brain doctor on neurological aspects"
        },
        {
          scenario: "Specialized Questions",
          description: "Each expert asks different questions about your symptoms",
          mapping: "Each head uses different query transformations",
          example: "Cardiologist asks about chest pain, neurologist about headaches"
        },
        {
          scenario: "Expert Knowledge",
          description: "Each specialist has different knowledge and perspective on your condition",
          mapping: "Each head learns different key-value associations",
          example: "Heart expert knows cardiac symptoms, brain expert knows neurological patterns"
        },
        {
          scenario: "Diagnosis Integration",
          description: "All expert opinions are combined into a comprehensive diagnosis",
          mapping: "Multi-head outputs are concatenated and projected",
          example: "Final diagnosis considers all specialist inputs weighted by relevance"
        }
      ],
      extensions: [
        "Expert training = different attention heads learning during model training",
        "Consultation complexity = more heads for handling more complex relationships",
        "Expert agreement/disagreement = attention head similarity/diversity patterns"
      ]
    },

    orchestra: {
      title: "The Orchestra Analogy",
      overview: "Multi-head attention as an orchestra with different instrument sections",
      detailedScenarios: [
        {
          scenario: "Musical Score (Input)",
          description: "The same musical score is given to all instrument sections",
          mapping: "All attention heads receive the same input sequence",
          example: "Violins, cellos, and trumpets all read the same composition"
        },
        {
          scenario: "Section Specialization",
          description: "Each instrument section focuses on different aspects: melody, harmony, rhythm",
          mapping: "Each attention head specializes in different linguistic patterns",
          example: "Violins focus on melody (syntax), cellos on harmony (semantics), drums on rhythm (position)"
        },
        {
          scenario: "Individual Performance",
          description: "Each section plays its part based on the score and their specialization",
          mapping: "Each head computes attention based on its learned parameters",
          example: "Strings emphasize melodic lines, brass emphasizes dramatic moments"
        },
        {
          scenario: "Conductor Integration",
          description: "The conductor blends all sections into a cohesive performance",
          mapping: "Output projection combines all attention heads",
          example: "Final musical piece is the harmonious combination of all instrumental parts"
        }
      ],
      extensions: [
        "Rehearsal process = model training where sections learn to work together",
        "Different compositions = different input sequences requiring different attention patterns",
        "Solo performances = individual head analysis for interpretability"
      ]
    },

    socialNetwork: {
      title: "The Social Network Analogy",
      overview: "Attention patterns as social network interactions and influence",
      detailedScenarios: [
        {
          scenario: "Social Media Posts (Tokens)",
          description: "Each person in your network creates posts with different content",
          mapping: "Tokens are like individual social media posts or people",
          example: "Friend A posts about cooking, Friend B about technology, Friend C about sports"
        },
        {
          scenario: "Personal Interests (Query)",
          description: "Your current interests determine what content you pay attention to",
          mapping: "Query represents current information needs or interests",
          example: "If you're interested in cooking today, you'll pay more attention to food-related posts"
        },
        {
          scenario: "Content Labels (Keys)",
          description: "Each post has implicit topics or hashtags that describe its content",
          mapping: "Keys represent the topics or types of information available",
          example: "#cooking, #tech, #sports tags help you identify relevant content"
        },
        {
          scenario: "Post Content (Values)",
          description: "The actual information, images, and details in each post",
          mapping: "Values contain the actual information to be consumed",
          example: "Cooking post contains recipe details, tech post has product reviews"
        },
        {
          scenario: "Attention Allocation",
          description: "You spend different amounts of time on posts based on relevance to your current interests",
          mapping: "Attention weights determine how much each token influences your understanding",
          example: "Spend 60% of time on cooking posts, 25% on tech, 15% on sports when interested in cooking"
        }
      ],
      extensions: [
        "Different social circles (multi-head) = professional network, family, hobby groups each with different interaction patterns",
        "Privacy settings (masking) = some content not visible based on relationships or timing",
        "Trending topics (position encoding) = recent posts get different treatment than older ones"
      ]
    },

    detective: {
      title: "The Detective Investigation Analogy",
      overview: "Attention as a detective gathering and evaluating clues",
      detailedScenarios: [
        {
          scenario: "Crime Scene Investigation",
          description: "A detective arrives at a crime scene with many potential clues scattered around",
          mapping: "Input tokens are like different pieces of evidence at a crime scene",
          example: "Fingerprints on a glass, footprints in mud, torn fabric on a fence, witness statements"
        },
        {
          scenario: "Investigation Focus (Query)",
          description: "Detective has specific questions they're trying to answer",
          mapping: "Query represents the current line of investigation or question being pursued",
          example: "Who was here last night? How did they enter? What were they looking for?"
        },
        {
          scenario: "Evidence Labels (Keys)",
          description: "Each piece of evidence has characteristics that might be relevant",
          mapping: "Keys describe what type of information each piece of evidence contains",
          example: "Fingerprint evidence, timeline evidence, motive evidence, physical evidence"
        },
        {
          scenario: "Actual Evidence (Values)",
          description: "The detailed information contained in each piece of evidence",
          mapping: "Values hold the actual information that can be used",
          example: "Fingerprint matches John Doe, footprint size 10, fabric from blue jacket, witness saw car at 9pm"
        },
        {
          scenario: "Relevance Assessment",
          description: "Detective evaluates how relevant each clue is to their current question",
          mapping: "Attention scores determine how relevant each evidence is",
          example: "Fingerprints highly relevant to 'who', timeline evidence highly relevant to 'when'"
        },
        {
          scenario: "Building the Case",
          description: "Detective combines evidence with appropriate weight based on relevance",
          mapping: "Weighted combination creates comprehensive understanding",
          example: "Strong fingerprint evidence + timeline + witness = 70% confidence in suspect identification"
        }
      ],
      extensions: [
        "Multiple detectives (multi-head) = different investigators focusing on different aspects (forensics, psychology, timeline)",
        "Classified information (masking) = some evidence only available after certain points in investigation",
        "Case complexity = more attention heads needed for complex multi-faceted crimes"
      ]
    },

    gps: {
      title: "The GPS Navigation Analogy",
      overview: "Attention as dynamic route planning and navigation",
      detailedScenarios: [
        {
          scenario: "Destination Planning (Query)",
          description: "You input your desired destination into the GPS system",
          mapping: "Query represents where you want to go or what information you're seeking",
          example: "Navigate to 'understanding of this sentence' or 'translate this phrase'"
        },
        {
          scenario: "Available Routes (Keys)",
          description: "GPS identifies multiple possible paths and evaluates their characteristics",
          mapping: "Keys represent different possible information pathways or connections",
          example: "Highway route (fast, direct), scenic route (detailed), local roads (context-rich)"
        },
        {
          scenario: "Route Details (Values)",
          description: "Each route contains specific information about distance, time, and conditions",
          mapping: "Values contain the actual navigational information",
          example: "Highway: 45 mins, 30 miles; Scenic: 65 mins, beautiful views; Local: 50 mins, through downtown"
        },
        {
          scenario: "Route Prioritization",
          description: "GPS weighs different routes based on current conditions and preferences",
          mapping: "Attention weights determine which information pathways to prioritize",
          example: "During rush hour, local roads get higher weight; for sightseeing, scenic route gets priority"
        },
        {
          scenario: "Dynamic Re-routing",
          description: "GPS continuously updates recommendations based on new information",
          mapping: "Attention patterns adapt based on context and new input",
          example: "Traffic jam ahead → re-weight alternate routes; road closure → completely change attention focus"
        }
      ],
      extensions: [
        "Multiple GPS units (multi-head) = different navigation strategies (fastest, most fuel efficient, most scenic)",
        "Road closures (masking) = certain routes unavailable due to constraints",
        "Real-time updates (position encoding) = current location affects available options"
      ]
    },

    dj: {
      title: "The DJ Music Mixing Analogy",
      overview: "Attention as mixing multiple audio tracks with dynamic balance",
      detailedScenarios: [
        {
          scenario: "Multiple Audio Tracks (Input Tokens)",
          description: "DJ has multiple simultaneous audio sources: vocals, bass, drums, melody, effects",
          mapping: "Each input token is like a separate audio track in the mix",
          example: "Track 1: vocals, Track 2: bass line, Track 3: drums, Track 4: guitar, Track 5: synth"
        },
        {
          scenario: "Mix Intention (Query)",
          description: "DJ has a specific sound they want to create for the current moment",
          mapping: "Query represents the desired output or focus for this position",
          example: "Create energetic dance section, build emotional climax, provide smooth transition"
        },
        {
          scenario: "Track Characteristics (Keys)",
          description: "Each track has properties that make it suitable for different purposes",
          mapping: "Keys describe what each track offers to the mix",
          example: "Heavy bass (energy), soft vocals (emotion), driving drums (rhythm), ambient synth (atmosphere)"
        },
        {
          scenario: "Track Content (Values)",
          description: "The actual audio data from each track",
          mapping: "Values contain the information that will be mixed into the output",
          example: "Actual bass frequencies, vocal melodies, drum patterns, guitar riffs"
        },
        {
          scenario: "Mixing Board Control",
          description: "DJ adjusts faders to control how much each track contributes to final mix",
          mapping: "Attention weights control contribution of each input to the output",
          example: "Vocals at 80%, bass at 90%, drums at 100%, guitar at 20%, synth at 40%"
        }
      ],
      extensions: [
        "Multiple DJs (multi-head) = different mixing styles simultaneously (bass-focused, melody-focused, rhythm-focused)",
        "Equipment limitations (masking) = some tracks only available at certain times",
        "Beat synchronization (position encoding) = timing affects how tracks can be mixed"
      ]
    },

    memory: {
      title: "The Human Memory Retrieval Analogy",
      overview: "Attention as selective memory recall and association",
      detailedScenarios: [
        {
          scenario: "Memory Trigger (Query)",
          description: "Something in your current experience triggers a memory search",
          mapping: "Query represents what you're trying to remember or understand",
          example: "Smell of cookies triggers search for childhood memories"
        },
        {
          scenario: "Memory Categories (Keys)",
          description: "Your brain categorizes memories by type, emotion, time period, people involved",
          mapping: "Keys represent how memories are indexed and categorized",
          example: "Childhood memories, food-related memories, happy memories, grandmother memories"
        },
        {
          scenario: "Actual Memories (Values)",
          description: "The detailed content of each memory with sensory and emotional information",
          mapping: "Values contain the actual memory content",
          example: "Grandma's kitchen, smell of fresh cookies, feeling of warmth and love, taste of chocolate chips"
        },
        {
          scenario: "Relevance Assessment",
          description: "Brain determines which memories are most relevant to current context",
          mapping: "Attention scores measure how relevant each memory is",
          example: "Grandmother's cookies highly relevant, school cafeteria cookies somewhat relevant, birthday cake less relevant"
        },
        {
          scenario: "Memory Integration",
          description: "Most relevant memories combine to create current understanding or emotional state",
          mapping: "Weighted combination creates current cognitive/emotional response",
          example: "Strong grandmother memory + moderate kitchen warmth memory = feeling of comfort and nostalgia"
        }
      ],
      extensions: [
        "Different memory systems (multi-head) = episodic memory, semantic memory, emotional memory working in parallel",
        "Repressed memories (masking) = some memories not accessible in certain contexts",
        "Memory formation (position encoding) = recent memories vs. distant memories have different accessibility"
      ]
    }
  },

  misconceptions: {
    attentionIsNot: [
      "Attention is NOT the same as human visual attention - it's a mathematical operation for information retrieval",
      "Attention weights are NOT always interpretable as 'what the model is looking at'",
      "High attention does NOT always mean positive relationships - it means relevance for the current task",
      "Attention is NOT a bottleneck that limits information flow - it's a routing mechanism",
      "Attention patterns are NOT fixed - they change based on input and learned parameters",
      "Attention does NOT replace understanding - it's a tool for information processing, not comprehension",
      "Multi-head attention does NOT mean the model has multiple 'minds' - it's parallel processing with different parameters",
      "Attention weights do NOT directly show causality - they show computational relevance",
      "Self-attention does NOT mean the model is self-aware - it means tokens attend to other tokens in the same sequence",
      "Attention is NOT always symmetric - A attending to B doesn't mean B attends equally to A"
    ],

    commonConfusions: [
      {
        misconception: "Attention weights directly show what the model is 'thinking about'",
        reality: "Attention weights show information routing patterns, not semantic focus",
        explanation: "Attention weights are learned parameters for optimal information combination, not necessarily aligned with human interpretability",
        analogy: "Like CPU cache hits - optimized for performance, not human understanding"
      },
      {
        misconception: "Higher attention weights always mean more important words",
        reality: "Higher weights mean more relevant for the specific computation at that layer",
        explanation: "Importance depends on the task, layer depth, and local computation needs. A function word might have high attention for syntactic reasons.",
        analogy: "Like ingredients in cooking - salt might get high attention not because it's the main dish, but because it's needed for flavor balance"
      },
      {
        misconception: "Self-attention means the model pays attention to itself",
        reality: "Self-attention means tokens within the same sequence attend to each other",
        explanation: "It's called 'self' because it's within a single sequence, as opposed to cross-attention between different sequences",
        analogy: "Like a group discussion where everyone can hear and respond to everyone else in the same room"
      },
      {
        misconception: "All attention heads do the same thing",
        reality: "Different heads learn different types of relationships and patterns",
        explanation: "Through different random initializations and training, heads naturally specialize in different linguistic or semantic patterns",
        analogy: "Like having different expert consultants - each brings unique expertise to the analysis"
      },
      {
        misconception: "Attention replaces recurrent connections completely",
        reality: "Attention provides a different mechanism for sequence modeling",
        explanation: "Attention allows parallel processing and long-range dependencies but approaches sequence modeling differently than RNNs",
        analogy: "Like switching from a bicycle (sequential) to a helicopter (can access any position directly)"
      },
      {
        misconception: "Transformers understand meaning the way humans do",
        reality: "Transformers process patterns in statistical distributions, not semantic meaning",
        explanation: "While transformers can appear to understand meaning, they're actually very sophisticated pattern matching and prediction systems",
        analogy: "Like a very advanced autocorrect that's learned incredibly complex patterns"
      },
      {
        misconception: "More attention heads always means better performance",
        reality: "There's a trade-off between model capacity, computational cost, and performance gains",
        explanation: "Beyond a certain point, additional heads may provide diminishing returns or even hurt performance through overfitting",
        analogy: "Like having too many cooks in the kitchen - more isn't always better"
      },
      {
        misconception: "Attention patterns are random or meaningless",
        reality: "Attention patterns reflect learned linguistic and semantic relationships",
        explanation: "While not always interpretable to humans, attention patterns encode systematic knowledge about language structure",
        analogy: "Like reading sheet music - it looks random if you don't know the notation, but contains structured information"
      },
      {
        misconception: "Positional encoding is optional for understanding word order",
        reality: "Without positional encoding, models can't distinguish word order",
        explanation: "Attention is inherently permutation-invariant, so positional information must be explicitly added",
        analogy: "Like trying to understand a story with all the sentences shuffled randomly"
      },
      {
        misconception: "Causal masking prevents the model from learning relationships",
        reality: "Causal masking enforces temporal constraints for specific tasks like language generation",
        explanation: "It prevents cheating by looking at future tokens, essential for autoregressive tasks",
        analogy: "Like covering the answer key during a test - ensures fair evaluation of actual understanding"
      }
    ],

    technicalClarifications: [
      {
        term: "Self-Attention",
        wrongInterpretation: "The model is introspecting or being self-aware",
        correctInterpretation: "Tokens within the same sequence computing attention to each other",
        example: "In 'The cat sat', each word computes attention to all words in the same sentence"
      },
      {
        term: "Multi-Head Attention",
        wrongInterpretation: "Multiple separate attention mechanisms running independently",
        correctInterpretation: "Parallel attention computations that are concatenated and projected together",
        example: "Like having multiple cameras with different lenses photograph the same scene, then combining the images"
      },
      {
        term: "Attention Scores",
        wrongInterpretation: "Direct measures of semantic similarity or importance",
        correctInterpretation: "Learned compatibility measures optimized for the downstream task",
        example: "High attention between 'the' and 'cat' might indicate grammatical relationship, not semantic importance"
      },
      {
        term: "Causal Masking",
        wrongInterpretation: "The model understands cause and effect relationships",
        correctInterpretation: "Architectural constraint preventing attention to future positions",
        example: "In language generation, word at position 3 cannot attend to words at positions 4, 5, 6..."
      },
      {
        term: "Attention Is All You Need",
        wrongInterpretation: "Attention is the only mechanism needed for all NLP tasks",
        correctInterpretation: "Attention can replace recurrence and convolution for sequence modeling",
        example: "Still need embeddings, normalization, feedforward layers, and other components for complete models"
      }
    ]
  },

  applications: {
    currentApplications: [
      {
        domain: "Natural Language Processing",
        examples: [
          "Machine Translation (Google Translate, DeepL)",
          "Text Summarization (OpenAI GPT, Claude)",
          "Question Answering (ChatGPT, Bard)",
          "Code Generation (GitHub Copilot, CodeT5)",
          "Sentiment Analysis and Classification"
        ],
        impact: "Revolutionized language understanding and generation across all major NLP tasks"
      },
      {
        domain: "Computer Vision",
        examples: [
          "Vision Transformer (ViT) for image classification",
          "Object Detection (DETR)",
          "Image Captioning",
          "Visual Question Answering",
          "Medical Image Analysis"
        ],
        impact: "Challenged CNN dominance and achieved state-of-the-art results in many vision tasks"
      },
      {
        domain: "Multimodal AI",
        examples: [
          "Text-to-Image Generation (DALL-E, Midjourney)",
          "Image-to-Text (GPT-4 Vision)",
          "Video Understanding",
          "Audio-Visual Learning",
          "Robotics Control"
        ],
        impact: "Enabled seamless integration of different modalities in AI systems"
      },
      {
        domain: "Scientific Applications",
        examples: [
          "Protein Structure Prediction (AlphaFold)",
          "Drug Discovery",
          "Climate Modeling",
          "Astronomy Data Analysis",
          "Materials Science"
        ],
        impact: "Accelerated scientific discovery through pattern recognition in complex data"
      }
    ],

    emergingApplications: [
      {
        domain: "Reinforcement Learning",
        description: "Decision Transformer uses attention for sequential decision making",
        potential: "More efficient learning of complex policies and strategies"
      },
      {
        domain: "Graph Neural Networks",
        description: "Graph Attention Networks for learning on graph-structured data",
        potential: "Better understanding of social networks, molecular structures, and knowledge graphs"
      },
      {
        domain: "Time Series Analysis",
        description: "Temporal attention for financial forecasting and sensor data analysis",
        potential: "More accurate predictions in finance, weather, and IoT applications"
      },
      {
        domain: "Neuroscience",
        description: "Understanding brain attention mechanisms through AI attention models",
        potential: "Insights into cognitive processes and neurological disorders"
      }
    ],

    limitations: [
      {
        issue: "Computational Complexity",
        description: "O(n²) complexity with sequence length limits scalability",
        mitigations: ["Linear attention variants", "Sparse attention patterns", "Local attention windows"]
      },
      {
        issue: "Interpretability",
        description: "Attention weights don't always correspond to human-interpretable focus",
        mitigations: ["Attention visualization tools", "Probing studies", "Alternative interpretation methods"]
      },
      {
        issue: "Training Instability",
        description: "Deep attention networks can be difficult to train",
        mitigations: ["Layer normalization", "Residual connections", "Careful initialization"]
      },
      {
        issue: "Data Requirements",
        description: "Large models require massive datasets for training",
        mitigations: ["Transfer learning", "Few-shot learning", "Data augmentation techniques"]
      }
    ]
  },

  progressiveComplexity: {
    level1_intuitive: {
      title: "Intuitive Understanding",
      content: [
        "Attention is like having a smart spotlight that can focus on relevant information",
        "Words that are more important for understanding get more attention",
        "Multiple attention heads are like having different types of experts look at the same text",
        "The model learns to automatically focus on what's most helpful for the task"
      ],
      analogies: ["Spotlight", "Library research", "Expert consultation"],
      visualizations: ["Simple attention heatmaps", "Token highlighting", "Weight distributions"]
    },
    level2_conceptual: {
      title: "Conceptual Knowledge",
      content: [
        "Attention mechanisms allow models to selectively focus on relevant parts of the input",
        "Query-Key-Value structure enables content-based information retrieval",
        "Softmax normalization ensures attention weights form valid probability distributions",
        "Multi-head attention captures different types of relationships in parallel"
      ],
      analogies: ["Database queries", "Orchestra sections", "Social network interactions"],
      visualizations: ["Attention matrices", "Head comparison", "Information flow diagrams"]
    },
    level3_implementation: {
      title: "Implementation Details",
      content: [
        "Scaled dot-product attention: Attention(Q,K,V) = softmax(QK^T/√d_k)V",
        "Multi-head attention concatenates and projects parallel attention computations",
        "Position encodings add sequence order information to token representations",
        "Attention masking enforces architectural constraints and prevents information leakage"
      ],
      analogies: ["Mathematical transformations", "Parallel processing", "Memory systems"],
      visualizations: ["Mathematical formulations", "Computational graphs", "Gradient flows"]
    }
  }
};

// Utility functions for accessing educational content
export function getStepExplanation(stepId: string, level: 'beginner' | 'intermediate' | 'advanced') {
  const step = EDUCATIONAL_CONTENT.steps.find(s => s.id === stepId);
  return step?.explanations[level];
}

export function getAnalogy(analogyType: keyof typeof EDUCATIONAL_CONTENT.analogies) {
  return EDUCATIONAL_CONTENT.analogies[analogyType];
}

export function getMisconceptions() {
  return EDUCATIONAL_CONTENT.misconceptions;
}

export function getApplications() {
  return EDUCATIONAL_CONTENT.applications;
}

export function getProgressiveContent(level: 'level1_intuitive' | 'level2_conceptual' | 'level3_implementation') {
  return EDUCATIONAL_CONTENT.progressiveComplexity[level];
}

// Interactive learning path generator
export function generateLearningPath(userLevel: 'beginner' | 'intermediate' | 'advanced', focusAreas: string[] = []) {
  const basePath = EDUCATIONAL_CONTENT.steps.map(step => ({
    stepId: step.id,
    title: step.title,
    explanation: step.explanations[userLevel],
    interactiveElements: step.interactiveElements,
    suggestedTime: userLevel === 'beginner' ? '10-15 min' : userLevel === 'intermediate' ? '15-20 min' : '20-30 min'
  }));

  // Add focus area specific content
  if (focusAreas.includes('applications')) {
    basePath.push({
      stepId: 'applications',
      title: 'Real-World Applications',
      explanation: {
        overview: 'Explore how attention mechanisms are used in real-world applications',
        keyPoints: EDUCATIONAL_CONTENT.applications.currentApplications.map(app => `${app.domain}: ${app.impact}`),
        visualCues: [],
        practicalTips: []
      },
      interactiveElements: [],
      suggestedTime: '5-10 min'
    });
  }

  return basePath;
}

// Analogy selection helper
export function selectOptimalAnalogy(userBackground: string, conceptDifficulty: 'low' | 'medium' | 'high') {
  const analogyMap: Record<string, string[]> = {
    'technical': ['detective', 'gps', 'memory'],
    'creative': ['dj', 'orchestra', 'socialNetwork'],
    'academic': ['library', 'multipleExperts', 'detective'],
    'general': ['spotlight', 'restaurant', 'memory'],
    'business': ['restaurant', 'multipleExperts', 'gps']
  };

  const difficultyMap = {
    'low': ['spotlight', 'restaurant', 'memory'],
    'medium': ['library', 'socialNetwork', 'detective'],
    'high': ['dj', 'gps', 'multipleExperts']
  };

  const backgroundAnalogies = analogyMap[userBackground] || analogyMap['general'];
  const difficultyAnalogies = difficultyMap[conceptDifficulty];
  
  // Find intersection or fallback to general
  const optimal = backgroundAnalogies.find(a => difficultyAnalogies.includes(a));
  return optimal || 'spotlight';
}

// Common mistake detector
export function detectCommonMistake(userInput: string, currentStep: string): CommonConfusion | null {
  const mistakes = EDUCATIONAL_CONTENT.misconceptions.commonConfusions;
  
  // Simple keyword matching for common mistakes
  const keywordMatches = {
    'thinking': mistakes.find(m => m.misconception.includes('thinking about')),
    'important': mistakes.find(m => m.misconception.includes('important words')),
    'self': mistakes.find(m => m.misconception.includes('pays attention to itself')),
    'meaning': mistakes.find(m => m.misconception.includes('understand meaning')),
    'heads': mistakes.find(m => m.misconception.includes('more attention heads')),
  };

  for (const [keyword, mistake] of Object.entries(keywordMatches)) {
    if (userInput.toLowerCase().includes(keyword) && mistake) {
      return mistake;
    }
  }

  return null;
}

// Progressive difficulty adjuster
export function adjustExplanationLevel(currentLevel: 'beginner' | 'intermediate' | 'advanced', 
                                     userPerformance: 'struggling' | 'comfortable' | 'advanced'): 'beginner' | 'intermediate' | 'advanced' {
  if (userPerformance === 'struggling') {
    return currentLevel === 'advanced' ? 'intermediate' : 'beginner';
  } else if (userPerformance === 'advanced') {
    return currentLevel === 'beginner' ? 'intermediate' : 'advanced';
  }
  return currentLevel;
}

// Interactive quiz questions
export const QUIZ_QUESTIONS = {
  attention_concept: {
    question: "What is the primary purpose of attention in transformers?",
    options: [
      "To make the model self-aware",
      "To selectively focus on relevant information",
      "To speed up computation",
      "To reduce model size"
    ],
    correct: 1,
    explanation: "Attention allows models to selectively focus on relevant parts of the input while de-emphasizing irrelevant information.",
    difficulty: 'beginner'
  },
  qkv_mechanism: {
    question: "In the Query-Key-Value mechanism, what does the Query represent?",
    options: [
      "The information being stored",
      "The search criteria or what we're looking for", 
      "The final output",
      "The input embeddings"
    ],
    correct: 1,
    explanation: "The Query represents what information we're seeking - like a search term in a database query.",
    difficulty: 'intermediate'
  },
  softmax_purpose: {
    question: "Why is softmax used in attention?",
    options: [
      "To make computation faster",
      "To convert scores to probabilities that sum to 1",
      "To increase the number of parameters",
      "To add non-linearity"
    ],
    correct: 1,
    explanation: "Softmax converts raw attention scores into probability distributions, ensuring all weights sum to 100% and providing a principled way to combine information.",
    difficulty: 'intermediate'
  },
  multihead_benefit: {
    question: "What is the main advantage of multi-head attention?",
    options: [
      "It uses less memory",
      "It's faster to compute",
      "It can capture different types of relationships in parallel",
      "It eliminates the need for training"
    ],
    correct: 2,
    explanation: "Multi-head attention allows the model to simultaneously attend to different types of relationships (syntax, semantics, etc.) through parallel processing.",
    difficulty: 'advanced'
  }
};

// Engagement enhancers
export const ENGAGEMENT_ELEMENTS = {
  celebratory_messages: [
    "Excellent! You're getting the hang of attention mechanisms! 🎉",
    "Great job! That's exactly how transformers process information! ⭐",
    "Perfect understanding! You're thinking like a transformer! 🧠",
    "Brilliant insight! You've grasped a key concept! 💡",
    "Outstanding! You're connecting the dots beautifully! 🌟"
  ],
  encouragement_messages: [
    "Don't worry, this is a complex topic - you're doing great! 💪",
    "Take your time - understanding attention takes practice! ⏰",
    "Every expert was once a beginner - keep exploring! 🚀",
    "You're building important foundations - stick with it! 🏗️",
    "Learning transformers is challenging but rewarding! 📈"
  ],
  curiosity_sparkers: [
    "Did you know? GPT-3 has 96 attention layers with 96 heads each!",
    "Fun fact: Attention was originally inspired by human visual attention research!",
    "Interesting: Some attention heads in BERT specialize in detecting syntactic relationships!",
    "Cool insight: Attention patterns can reveal model biases and reasoning paths!",
    "Amazing: Modern transformers can attend to sequences of 100,000+ tokens!"
  ]
};

// Export types and interfaces for use in components
export type { 
  EducationalContent, 
  StepContent, 
  LeveledExplanations, 
  ExplanationContent,
  InteractiveElement,
  AnalogiesLibrary,
  MisconceptionsLibrary,
  ApplicationsLibrary 
};