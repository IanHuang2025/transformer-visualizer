"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { LearningJourneyProvider, useLearningJourney } from "@/hooks/useLearningJourney";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Info, RefreshCw, ChevronLeft, ChevronRight, Book, Lightbulb, Calculator, AlertCircle, CheckCircle, ExternalLink, FileText, Video, Code } from "lucide-react";
import { WelcomeModal } from "@/components/WelcomeModal";
import { LearningProgress } from "@/components/LearningProgress";
import { useWelcome } from "@/contexts/WelcomeContext";


/*
  Transformer Visualizer — Interactive
  ------------------------------------
  This single-file React component visualizes the core mechanics of a Transformer self-attention block.
  - Type a sentence (tokens split by spaces) or pick a preset.
  - Choose # of heads (1–4). Head dim is fixed to 4 so d_model = heads * 4.
  - Toggle causal mask and positional encodings.
  - Click a token to inspect its Query-row: scores, softmax weights, and the weighted sum over Values.
  - Switch across heads and step through the pipeline.

  The math is faithful but small-dim and seeded for determinism. No external services.
*/

import { SentenceSettingsPanel } from '@/components/ConfigurationPanels/SentenceSettingsPanel';
import { AttentionHeadsPanel } from '@/components/ConfigurationPanels/AttentionHeadsPanel';
import { PositionalEncodingsPanel } from '@/components/ConfigurationPanels/PositionalEncodingsPanel';
import { CausalMaskPanel } from '@/components/ConfigurationPanels/CausalMaskPanel';
import { SelectedTokenPanel } from '@/components/ConfigurationPanels/SelectedTokenPanel';
import { EducationalSystem } from '@/components/Educational/EducationalSystem';

// Mock animation hooks (to be replaced with full implementation later)
const useAnimationClasses = () => ({
  enabled: true,
  tokenSelection: 'transition-all duration-300',
  vectorTransform: 'transition-transform duration-500',
  progressFill: 'transition-width duration-300',
  matrixCell: 'transition-all duration-300',  
  cardHover: 'hover:shadow-md transition-shadow duration-200',
  fadeInUp: 'animate-fade-in-up',
  progressFill: 'transition-all duration-500',
  stepIndicator: 'transition-all duration-300'
});

const useAnimation = () => ({
  state: {
    isCalculating: false,
    currentStep: null,
    isTransitioning: false,
    showCelebration: false,
    completedSteps: new Set()
  },
  startCalculation: () => {},
  stopCalculation: () => {}
});

// ---------- Utilities ----------
function hashStringToInt(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randn(prng: () => number) {
  // Box–Muller
  const u = Math.max(1e-12, prng());
  const v = Math.max(1e-12, prng());
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function zeros(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
}

function matmul(A: number[][], B: number[][]) {
  const m = A.length, n = A[0].length, p = B[0].length;
  const C = zeros(m, p);
  for (let i = 0; i < m; i++) {
    for (let k = 0; k < n; k++) {
      const a = A[i][k];
      for (let j = 0; j < p; j++) C[i][j] += a * B[k][j];
    }
  }
  return C;
}

function add(A: number[][], B: number[][]) {
  const C = zeros(A.length, A[0].length);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) C[i][j] = A[i][j] + B[i][j];
  }
  return C;
}

function softmaxRow(row: number[], mask?: (v: number, j: number) => boolean) {
  const m = row.length;
  const scores = row.slice();
  const NEG = -1e9;
  for (let j = 0; j < m; j++) {
    if (mask && !mask(scores[j], j)) scores[j] = NEG;
  }
  const maxv = Math.max(...scores);
  const exps = scores.map((v) => Math.exp(v - maxv));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / (sum || 1));
}

function transpose(A: number[][]) {
  const m = A.length, n = A[0].length;
  const T = zeros(n, m);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) T[j][i] = A[i][j];
  }
  return T;
}

function clip(x: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, x));
}

function round4(x: number) {
  return Math.round(x * 1000) / 1000;
}

function colorFromWeight(w: number) {
  // w in [0,1] -> use HSL: light to accent
  const light = 96; // near white
  const dark = 45;  // deeper fill
  const l = light - (light - dark) * clip(w, 0, 1);
  return `hsl(220 90% ${l}%)`;
}

function colorFromScore(z: number) {
  // centered colormap: negative -> bluish, positive -> reddish
  const t = Math.tanh(z / 4); // squashed to [-1,1]
  const hue = t > 0 ? 10 : 210;
  const sat = 85;
  const light = 50 + (1 - Math.abs(t)) * 30; // stronger -> darker
  return `hsl(${hue} ${sat}% ${light}%)`;
}

// Positional encoding (small, toy): sin/cos on indices into d_model dims
function positionalEncoding(T: number, d_model: number) {
  const P = zeros(T, d_model);
  for (let pos = 0; pos < T; pos++) {
    for (let i = 0; i < d_model; i++) {
      const div = Math.pow(10000, (2 * Math.floor(i / 2)) / d_model);
      if (i % 2 === 0) P[pos][i] = Math.sin(pos / div);
      else P[pos][i] = Math.cos(pos / div);
    }
  }
  return P;
}

// ---------- Core calculation ----------
function makeEmbeddings(tokens: string[], d_model: number, usePositional: boolean) {
  const T = tokens.length;
  const E = zeros(T, d_model);
  for (let t = 0; t < T; t++) {
    const seed = hashStringToInt(tokens[t]);
    const rng = mulberry32(seed);
    for (let i = 0; i < d_model; i++) E[t][i] = randn(rng) * 0.5;
  }
  if (usePositional) return add(E, positionalEncoding(T, d_model));
  return E;
}

function makeWeights(heads: number, d_model: number, d_k: number, masterSeed: number) {
  const WQ: number[][][] = []; // [h][d_model][d_k]
  const WK: number[][][] = [];
  const WV: number[][][] = [];
  const WO: number[][] = zeros(heads * d_k, d_model);

  for (let h = 0; h < heads; h++) {
    const rng = mulberry32(masterSeed + h * 97);
    const wq = zeros(d_model, d_k);
    const wk = zeros(d_model, d_k);
    const wv = zeros(d_model, d_k);
    for (let i = 0; i < d_model; i++) {
      for (let j = 0; j < d_k; j++) {
        wq[i][j] = randn(rng) / Math.sqrt(d_model);
        wk[i][j] = randn(rng) / Math.sqrt(d_model);
        wv[i][j] = randn(rng) / Math.sqrt(d_model);
      }
    }
    WQ.push(wq); WK.push(wk); WV.push(wv);
  }
  // Output projection
  const rngO = mulberry32(masterSeed + 1337);
  for (let i = 0; i < heads * d_k; i++) {
    for (let j = 0; j < d_model; j++) WO[i][j] = randn(rngO) / Math.sqrt(heads * d_k);
  }
  return { WQ, WK, WV, WO };
}

function attentionForHead(X: number[][], WQ: number[][], WK: number[][], WV: number[][], causal: boolean) {
  const d_k = WQ[0].length;
  const Q = matmul(X, WQ); // T x d_k
  const K = matmul(X, WK); // T x d_k
  const V = matmul(X, WV); // T x d_k (toy: V dim = d_k)

  const KT = transpose(K); // d_k x T
  const scale = 1 / Math.sqrt(d_k);
  const Scores = matmul(Q, KT).map((row) => row.map((v) => v * scale)); // T x T

  const Weights = Scores.map((row, i) =>
    softmaxRow(row, (_v, j) => (causal ? j <= i : true))
  ); // T x T

  const HeadOut = matmul(Weights, V); // T x d_k
  return { Q, K, V, Scores, Weights, HeadOut };
}

// ---------- Enhanced UI Components with Animations ----------
function TokenChips({ tokens, selected, setSelected }: { tokens: string[]; selected: number; setSelected: (i: number) => void }) {
  const animationClasses = useAnimationClasses();
  
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((tk, i) => (
        <button
          key={i}
          onClick={() => setSelected(i)}
          className={`px-3 py-1 rounded-2xl text-sm border transition-all duration-300 transform hover:scale-105 ${
            i === selected ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-muted hover:bg-accent"
          } ${animationClasses.tokenSelection}`}
          title={`Select token #${i}`}
          style={{
            animationDelay: `${i * 100}ms`
          }}
        >
          <span className="opacity-70 mr-1">{i}</span>{tk}
        </button>
      ))}
    </div>
  );
}

function Matrix({ M, highlightRow, mode }: { M: number[][]; highlightRow?: number; mode: "weights" | "scores" }) {
  const animationClasses = useAnimationClasses();
  
  const getColorFromValue = (score: number) => {
    if (mode === "weights") {
      // Softmax weights: 0-1, use blue scale
      const intensity = Math.max(0, Math.min(1, score));
      return `rgb(${Math.round(59 + intensity * 136)}, ${Math.round(130 + intensity * 126)}, ${Math.round(246)})`;
    } else {
      // Raw scores: can be negative/positive, use diverging scale
      const normalized = Math.max(-2, Math.min(2, score));
      if (normalized < 0) {
        const intensity = Math.abs(normalized) / 2;
        return `rgb(${Math.round(59 + intensity * 137)}, ${Math.round(130 - intensity * 127)}, ${Math.round(246 - intensity * 143)})`;
      } else {
        const intensity = normalized / 2;
        return `rgb(${Math.round(220 - intensity * 161)}, ${Math.round(38 + intensity * 92)}, ${Math.round(38 + intensity * 208)})`;
      }
    }
  };

  return (
    <div className="overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="p-2 border text-left">Token</th>
            {M[0]?.map((_v, j) => (
              <th key={j} className="p-2 border text-center">{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {M.map((row, i) => {
            const isHL = highlightRow === i;
            return (
              <tr key={i} className={`${isHL ? "bg-blue-50" : ""} ${animationClasses.fadeInUp}`}
                  style={{ animationDelay: `${i * 100}ms` }}>
                <td className={`p-2 border font-mono transition-all duration-300 ${isHL ? "bg-blue-100 font-bold scale-105" : ""}`}>{i}</td>
                {row.map((v, j) => (
                  <td key={j} 
                      className={`p-2 border text-center font-mono transition-all duration-300 ${animationClasses.matrixCell}`} 
                      style={{ 
                        backgroundColor: getColorFromValue(v),
                        color: mode === "weights" && v > 0.5 ? "white" : "black",
                        animationDelay: `${(i * row.length + j) * 50}ms`
                      }}>
                    {mode === "weights" ? `${Math.round(v * 100)}%` : round4(v)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VectorTable({ title, vectors, labels }: { title: string; vectors: number[][]; labels: string[] }) {
  const animationClasses = useAnimationClasses();
  
  return (
    <Card className={`shadow-sm ${animationClasses.cardHover}`}>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-1">token#</th>
                {vectors[0]?.map((_v, j) => (
                  <th key={j} className="p-1 text-right">d{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vectors.map((row, i) => (
                <tr key={i} className={`odd:bg-muted/50 transition-colors duration-200 ${animationClasses.fadeInUp}`} 
                    style={{ animationDelay: `${i * 100}ms` }}>
                  <td className="p-1 font-mono">{labels[i]}</td>
                  {row.map((v, j) => (
                    <td key={j} className="p-1 text-right font-mono">{round4(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function EducationalPanel({ 
  stepKey, 
  learningMode, 
  currentStepIndex, 
  totalSteps, 
  onPreviousStep, 
  onNextStep 
}: { 
  stepKey: StepKey; 
  learningMode: 'beginner' | 'intermediate' | 'advanced';
  currentStepIndex: number;
  totalSteps: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
}) {
  const explanation = STEP_EXPLANATIONS[stepKey];
  
  return (
    <Card className="shadow-sm border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold text-blue-900">{explanation.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {learningMode === 'beginner' && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🌱 Simplified</span>}
            {learningMode === 'intermediate' && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">🌿 Detailed</span>}
            {learningMode === 'advanced' && <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">🌳 Technical</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overview */}
        <div>
          <div className="text-sm text-gray-700 leading-relaxed">{explanation.overview}</div>
        </div>
        
        {/* Intuitive Explanation - Always shown */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-sm font-medium text-green-900">Intuitive Understanding</span>
              <p className="text-sm text-green-800 mt-1">{explanation.intuition}</p>
            </div>
          </div>
        </div>

        {/* Key Details - Shown for Intermediate and Advanced */}
        {learningMode !== 'beginner' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Key Concepts</span>
            </div>
            <ul className="space-y-1">
              {explanation.details.map((detail, i) => (
                <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                  <div>{detail}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Mathematical Formula - Only for Advanced */}
        {learningMode === 'advanced' && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Mathematical Formula</span>
            </div>
            <code className="text-sm text-blue-800 font-mono bg-blue-100 px-2 py-1 rounded">
              {explanation.math}
            </code>
          </div>
        )}
        
        {/* Why This Matters - Shown for Intermediate and Advanced */}
        {learningMode !== 'beginner' && (
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-medium text-purple-900">Why This Step Matters</span>
                <p className="text-sm text-purple-800 mt-1">{explanation.whyImportant}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step Navigation */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPreviousStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Step
          </Button>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          </div>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={onNextStep}
            disabled={currentStepIndex === totalSteps - 1}
            className="flex items-center gap-2"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const PRESETS = [
  { id: "cat", text: "The cat sat on the mat" },
  { id: "bank", text: "I saw a bank by the river" },
  { id: "paren", text: "if ( x > 0 ) { return y } else { return z }" },
  { id: "code", text: "for i in range 10 print i" },
];

const STEPS = [
  { key: "embed", label: "Step 1: Token Embeddings", shortLabel: "Embeddings" },
  { key: "qkv", label: "Step 2: Query, Key & Value", shortLabel: "Q, K, V" },
  { key: "scores", label: "Step 3: Attention Scores", shortLabel: "Scores" },
  { key: "softmax", label: "Step 4: Softmax Weights", shortLabel: "Softmax" },
  { key: "weighted", label: "Step 5: Weighted Values", shortLabel: "Weighted Sum" },
  { key: "mh", label: "Step 6: Multi-Head Output", shortLabel: "Multi-Head" },
] as const;

// Glossary of key terms
const GLOSSARY = {
  "attention": "A mechanism that allows the model to focus on different parts of the input when processing each token. Like a spotlight that can illuminate different words.",
  "query": "A vector that represents 'what information this token is looking for'. Think of it as a search query.",
  "key": "A vector that represents 'what information this token can provide'. Like keywords that help match with queries.",
  "value": "A vector that contains the actual information/content that will be used in the output. The payload.",
  "embedding": "A high-dimensional vector representation of a token (word). Similar words have similar embeddings.",
  "softmax": "A mathematical function that converts any set of numbers into probabilities (between 0 and 1, summing to 1).",
  "token": "A unit of text, typically a word or subword, that the model processes.",
  "head": "One of multiple parallel attention mechanisms. Each head can learn different types of relationships.",
  "causal": "A masking technique where tokens can only attend to previous positions, not future ones. Used in decoder models.",
  "positional": "Encodings that add information about the position/order of tokens in the sequence.",
  "matrix": "A 2D array of numbers. In attention, often represents relationships between all pairs of tokens.",
  "vector": "A 1D array of numbers representing a token or computed result.",
  "dot_product": "A mathematical operation that measures similarity between vectors. Higher values = more similar.",
  "concatenate": "Joining vectors or matrices end-to-end to combine information from multiple sources."
};

// Helper component for tooltips on terms
function GlossaryTooltip({ term, children }: { term: keyof typeof GLOSSARY; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted cursor-help text-blue-600 hover:text-blue-800">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="text-sm">
          <div className="font-semibold mb-1 capitalize">{term.replace('_', ' ')}</div>
          <div>{GLOSSARY[term]}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}


// Educational content for each step
const STEP_EXPLANATIONS = {
  embed: {
    title: "Token Embeddings: Converting Words to Numbers",
    overview: (
      <>
        Every word needs to become a <GlossaryTooltip term="vector">vector</GlossaryTooltip> of numbers that the model can work with. 
        Think of this as creating a unique &apos;fingerprint&apos; for each word.
      </>
    ),
    details: [
      <>Each <GlossaryTooltip term="token">token</GlossaryTooltip> (word) gets converted to a high-dimensional <GlossaryTooltip term="vector">vector</GlossaryTooltip></>,
      <>Similar words have similar <GlossaryTooltip term="embedding">embeddings</GlossaryTooltip> in this vector space</>,
      <><GlossaryTooltip term="positional">Positional encodings</GlossaryTooltip> add information about where each word appears in the sentence</>,
      <>This gives the model both semantic (meaning) and positional (order) information</>
    ],
    intuition: "🎨 Imagine each word as a color. Similar words have similar colors, and position adds a unique pattern to each color.",
    math: "X = TokenEmbedding + PositionalEncoding",
    whyImportant: "Without embeddings, the model couldn't understand the meaning or position of words. This is the foundation that makes everything else possible."
  },
  qkv: {
    title: "Query, Key, Value: The Attention Mechanism Setup",
    overview: (
      <>
        We transform each token&apos;s <GlossaryTooltip term="embedding">embedding</GlossaryTooltip> into three different &apos;roles&apos;: 
        <GlossaryTooltip term="query">Query</GlossaryTooltip> (what I&apos;m looking for), 
        <GlossaryTooltip term="key">Key</GlossaryTooltip> (what I offer), and 
        <GlossaryTooltip term="value">Value</GlossaryTooltip> (what I contain).
      </>
    ),
    details: [
      <><GlossaryTooltip term="query">Query (Q)</GlossaryTooltip>: &apos;What information is this <GlossaryTooltip term="token">token</GlossaryTooltip> seeking?&apos; - like a search query</>,
      <><GlossaryTooltip term="key">Key (K)</GlossaryTooltip>: &apos;What information does this token advertise?&apos; - like keywords for search</>,
      <><GlossaryTooltip term="value">Value (V)</GlossaryTooltip>: &apos;What information does this token actually contain?&apos; - the payload</>,
      <>Each role uses different learned weight matrices (WQ, WK, WV)</>
    ],
    intuition: "🔍 Think of a library: Query is your question, Keys are book titles/topics, Values are the actual book contents.",
    math: "Q = X·WQ, K = X·WK, V = X·WV",
    whyImportant: "This separation allows tokens to play different roles - seeking information vs. providing information vs. containing information."
  },
  scores: {
    title: "Attention Scores: Measuring Relevance",
    overview: "We calculate how much each token should 'pay attention' to every other token by comparing queries with keys.",
    details: [
      "Dot product measures similarity between query and key vectors",
      "Higher scores mean higher relevance/similarity",
      "Scaling by √d prevents scores from getting too large",
      "Each row shows one token's attention scores to all tokens"
    ],
    intuition: "🎯 Like measuring how relevant each book is to your research question - some books are very relevant (high score), others aren't (low score).",
    math: "Scores = (Q·Kᵀ)/√d_k",
    whyImportant: "Raw similarity scores tell us which tokens are most relevant to each other, forming the basis for selective attention."
  },
  softmax: {
    title: "Softmax: Converting Scores to Probabilities",
    overview: "Raw scores are converted to probabilities that sum to 1, creating a probability distribution over all tokens.",
    details: [
      "Softmax converts any set of numbers to probabilities (0-1, sum=1)",
      "Higher scores become higher probabilities",
      "Causal masking prevents 'looking ahead' in decoder models",
      "Each row becomes a probability distribution"
    ],
    intuition: "🎲 Like converting raw preference scores into a budget - you have 100% attention to distribute across all words.",
    math: "Weights = softmax(Scores) = exp(scores) / Σexp(scores)",
    whyImportant: "Probabilities ensure the model pays the right amount of attention - not too much to irrelevant tokens, not too little to important ones."
  },
  weighted: {
    title: "Weighted Sum: Gathering Information",
    overview: "We combine the value vectors using the attention weights, creating a new representation that focuses on relevant information.",
    details: [
      "Each value vector is multiplied by its attention weight",
      "All weighted values are summed together",
      "Result contains information from all tokens, weighted by relevance",
      "This creates a context-aware representation for each token"
    ],
    intuition: "📚 Like writing a summary where you include more content from highly relevant sources and less from irrelevant ones.",
    math: "Output = Σ(Weights × Values)",
    whyImportant: "This step actually transfers information between tokens based on attention, creating context-aware representations."
  },
  mh: {
    title: "Multi-Head Attention: Parallel Processing",
    overview: "Multiple attention 'heads' process different types of relationships simultaneously, then their outputs are combined.",
    details: [
      "Each head can focus on different types of relationships (syntax, semantics, etc.)",
      "Heads work in parallel with different learned parameters",
      "Outputs are concatenated along the feature dimension",
      "Final linear layer (WO) mixes information from all heads"
    ],
    intuition: "👥 Like having multiple experts analyze the same text from different perspectives, then combining their insights.",
    math: "MultiHead = Linear(Concat(head₁, head₂, ..., headₕ))",
    whyImportant: "Multiple heads allow the model to capture different types of relationships simultaneously - like syntax, coreference, and semantic similarity."
  }
};

type StepKey = typeof STEPS[number]["key"];

function TransformerVisualizerCore() {
  // Animation classes
  const animationClasses = useAnimationClasses();
  
  const [preset, setPreset] = useState("cat");
  const [text, setText] = useState(PRESETS[0].text);
  const [heads, setHeads] = useState(3);
  const d_k = 4;
  const d_model = heads * d_k;
  const [causal, setCausal] = useState(true);
  const [usePos, setUsePos] = useState(true);
  const [selectedHead, setSelectedHead] = useState(0);
  const [selectedToken, setSelectedToken] = useState(0);
  const [seed, setSeed] = useState(1234);
  const [stepIdx, setStepIdx] = useState(0);
  
  // Animation and UI state
  const animationsEnabled = true;
  const isTransitioning = false;
  const [_showCelebration, setShowCelebration] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Learning Journey management
  const { 
    learningPath, 
    completedSteps,
    _completeStep,
    markInteraction
  } = useLearningJourney();
  
  // Welcome management (legacy)
  const { 
    showWelcome, 
    hideWelcomeModal, 
    markWelcomeSeen, 
    _markStepCompleted
  } = useWelcome();
  
  // Animation state
  const stepContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (stepIdx === STEPS.length - 1) {
      setShowCelebration(true);
    }
  }, [stepIdx]);

  const tokens = useMemo(() => text.trim().split(/\s+/).slice(0, 16), [text]);

  const E = useMemo(() => makeEmbeddings(tokens, d_model, usePos), [tokens, d_model, usePos]);
  const { WQ, WK, WV, WO } = useMemo(() => makeWeights(heads, d_model, d_k, seed), [heads, d_model, d_k, seed]);

  const headsData = useMemo(() => {
    return Array.from({ length: heads }, (_, h) => attentionForHead(E, WQ[h], WK[h], WV[h], causal));
  }, [E, WQ, WK, WV, causal, heads]);

  const H_concat = useMemo(() => {
    // concat HeadOut along feature dim
    const T = tokens.length;
    const cat = zeros(T, heads * d_k);
    for (let h = 0; h < heads; h++) {
      for (let t = 0; t < T; t++) {
        for (let j = 0; j < d_k; j++) cat[t][h * d_k + j] = headsData[h].HeadOut[t][j];
      }
    }
    return cat;
  }, [headsData, heads, d_k, tokens.length]);

  const MHA_out = useMemo(() => matmul(H_concat, WO), [H_concat, WO]);

  const stepKey: StepKey = STEPS[stepIdx].key;

  // Animation functions
  const startCalculation = (step: string) => {
    console.log(`Starting calculation for step: ${step}`);
  };
  
  const stopCalculation = () => {
    console.log('Stopping calculation');
  };

  // Animation triggers based on step
  useEffect(() => {
    if (isCalculating) {
      startCalculation(stepKey);
      // Stop calculation after some time for demo purposes
      const timer = setTimeout(() => {
        setIsCalculating(false);
        stopCalculation();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCalculating, stepKey]);
  
  // Handle welcome path selection
  const handleWelcomePathSelect = (path: typeof learningPath) => {
    markWelcomeSeen(path);
  };

  return (
    <TooltipProvider>
      <EducationalSystem
        activePanels={['sentence', 'heads', 'positional', 'causal', 'selected-token']}
        currentSettings={{
          text,
          heads,
          usePositional: usePos,
          causal,
          selectedToken,
          selectedHead
        }}
      >
        <div className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-4">
        {/* Welcome Modal */}
        <WelcomeModal 
          isOpen={showWelcome} 
          onClose={hideWelcomeModal}
          onPathSelect={handleWelcomePathSelect}
        />
        
        {/* Learning Progress */}
        <LearningProgress 
          currentStep={stepKey} 
          onStepChange={(step) => {
            const newStepIdx = STEPS.findIndex(s => s.key === step);
            if (newStepIdx !== -1) setStepIdx(newStepIdx);
          }}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Transformer Self-Attention — Interactive</h1>
            <p className="text-sm text-muted-foreground mt-1">
              An educational visualization of how attention works in transformer models
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Learning Mode Display (now managed by welcome flow) */}
            <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
              {learningPath === 'beginner' && '🌱 Beginner Mode'}
              {learningPath === 'intermediate' && '🌿 Intermediate Mode'}
              {learningPath === 'advanced' && '🌳 Advanced Mode'}
            </div>
            
            <Button variant="outline" size="sm" onClick={() => setSeed((s) => s + 1)} title="Randomize weights">
              <RefreshCw className="w-4 h-4 mr-2" /> Randomize
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setStepIdx(0); setSelectedToken(0); setSelectedHead(0); }} title="Reset view">
              Reset
            </Button>
          </div>
        </div>

        {/* Configuration Panels - New Educational Interface */}
        <div className="space-y-3">
          <SentenceSettingsPanel 
            preset={preset}
            text={text}
            onPresetChange={setPreset}
            onTextChange={setText}
            onLoadPreset={() => {}} 
            onTextInteraction={() => markInteraction('text-input', 'sentence-change')}
          />
          
          <AttentionHeadsPanel
            heads={heads}
            onHeadsChange={setHeads}
          />
          
          <PositionalEncodingsPanel
            usePositional={usePos}
            onPositionalChange={setUsePos}
            onInteraction={() => markInteraction('attention-intro', 'positional-change')}
          />
          
          <CausalMaskPanel
            causalMask={causal}
            onCausalMaskChange={setCausal}
            onInteraction={() => markInteraction('attention-intro', 'causal-change')}
          />
          
          <SelectedTokenPanel
            selectedToken={selectedToken}
            onTokenSelect={setSelectedToken}
            tokens={tokens}
            attentionWeights={headsData[selectedHead]?.Weights}
            currentHead={selectedHead}
          />
        </div>


        {/* Token chips */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium mb-3">Tokens</div>
            </div>
            <TokenChips tokens={tokens} selected={selectedToken} setSelected={(i) => {
              setSelectedToken(i);
              markInteraction('tokenization', 'token-selected');
            }} />
          </CardContent>
        </Card>

        {/* Enhanced Stepper - Using our Progress Dashboard instead */}

        {/* Head tabs */}
        <Tabs value={String(selectedHead)} onValueChange={(v) => {
          setSelectedHead(parseInt(v));
          markInteraction('heads-setup', 'head-explored');
        }}>
          <TabsList>
            {Array.from({ length: heads }, (_, h) => (
              <TabsTrigger key={h} value={String(h)}>Head {h}</TabsTrigger>
            ))}
          </TabsList>

          {Array.from({ length: heads }, (_, h) => {
            const data = headsData[h];
            const showScores = stepKey === "scores";
            const showWeights = stepKey === "softmax" || stepKey === "weighted" || stepKey === "mh";
            const showQKV = stepKey === "qkv";
            const showEmbed = stepKey === "embed";
            const showWeighted = stepKey === "weighted" || stepKey === "mh";

            return (
              <TabsContent key={h} value={String(h)} className="space-y-4">
                {/* Step transition wrapper */}
                <div 
                  ref={stepContentRef}
                  className={animationsEnabled && isTransitioning ? 'animate-fade-in-up' : ''}
                >
                  {/* Educational Explanation Panel */}
                  <EducationalPanel 
                    stepKey={stepKey} 
                    learningMode={learningPath}
                    currentStepIndex={stepIdx}
                    totalSteps={STEPS.length}
                    onPreviousStep={() => setStepIdx(Math.max(0, stepIdx - 1))}
                    onNextStep={() => {
                      // Mark current step as completed when advancing
                      markInteraction('attention-intro', stepKey);
                      setStepIdx(Math.min(STEPS.length - 1, stepIdx + 1));
                    }}
                  />
                
                {/* Interactive Quiz - Placeholder for future implementation */}
                {learningPath !== 'beginner' && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="text-sm text-yellow-800">
                      Interactive quiz for this step coming soon!
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left column: matrix & explanations */}
                  <div className="space-y-3">
                    <Card>
                      <CardHeader className="py-3">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm">Attention {showScores ? "Scores" : showWeights ? "Weights" : "Matrix"}</CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px] text-xs">
                              <div className="font-medium mb-1">Rows = Queries (token asking)</div>
                              <div>Cols = Keys (token being looked at). We color-code {showScores ? "scaled dot-products (Q·K/√d)" : "softmax weights"}.</div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {showScores && <Matrix M={data.Scores} highlightRow={selectedToken} mode="scores" />}
                        {showWeights && <Matrix M={data.Weights} highlightRow={selectedToken} mode="weights" />}
                        {!showScores && !showWeights && <Matrix M={data.Weights} highlightRow={selectedToken} mode="weights" />}
                        
                        {/* Color Legend */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs font-medium text-gray-700 mb-2">Color Legend</div>
                          {showScores ? (
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromScore(-2)}}></div>
                                <span>Negative (dissimilar)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromScore(0)}}></div>
                                <span>Neutral</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromScore(2)}}></div>
                                <span>Positive (similar)</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromWeight(0)}}></div>
                                <span>0% attention</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromWeight(0.5)}}></div>
                                <span>50% attention</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-4 h-4 rounded" style={{backgroundColor: colorFromWeight(1)}}></div>
                                <span>100% attention</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          <strong>Focus:</strong> Token #{selectedToken} &quot;{tokens[selectedToken]}&quot; (highlighted row)
                          <br />
                          <strong>Interpretation:</strong> How much this token {showScores ? "is similar to" : "attends to"} each other token
                        </div>
                      </CardContent>
                    </Card>

                    {showWeighted && (
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm">Weighted Sum for token #{selectedToken} (A·V)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-xs text-muted-foreground mb-2">Output vector of this head for the selected token.</div>
                          <div className="flex flex-wrap gap-2">
                            {data.HeadOut[selectedToken].map((v, j) => (
                              <div key={j} className="px-2 py-1 rounded-md bg-muted font-mono text-xs">{round4(v)}</div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Right column: vectors */}
                  <div className="space-y-3">
                    {showEmbed && (
                      <VectorTable 
                        title="Token Embeddings (with optional position)" 
                        vectors={E} 
                        labels={tokens.map((_t, i) => String(i))}
                      />
                    )}
                    {showQKV && (
                      <div className={`grid gap-3 ${
                        animationClasses.fadeInUp
                      }`}>
                        <VectorTable 
                          title={`Q (Head ${h}) — the &quot;question&quot;`} 
                          vectors={data.Q} 
                          labels={tokens.map((_t, i) => String(i))}
                        />
                        <VectorTable 
                          title={`K (Head ${h}) — the &quot;what I offer&quot; tag`} 
                          vectors={data.K} 
                          labels={tokens.map((_t, i) => String(i))}
                        />
                        <VectorTable 
                          title={`V (Head ${h}) — the payload`} 
                          vectors={data.V} 
                          labels={tokens.map((_t, i) => String(i))}
                        />
                      </div>
                    )}
                    {!showQKV && (
                      <Card className="shadow-sm bg-slate-50">
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-600" />
                            Quick Reference
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-xs">
                            <div><strong>Matrix Colors:</strong> Blue = negative, Red = positive, Light = low weight, Dark = high weight</div>
                            <div><strong>Selected Token:</strong> #{selectedToken} &quot;{tokens[selectedToken]}&quot; - highlighted row shows its attention pattern</div>
                            <div><strong>Current Head:</strong> {selectedHead} - each head learns different relationship patterns</div>
                            {causal && <div><strong>Causal Mask:</strong> ON - tokens can&apos;t see future positions (decoder-style)</div>}
                            {usePos && <div><strong>Positional Encoding:</strong> ON - adds order information to embeddings</div>}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Multi-head combine (always visible in final step) */}
                {stepKey === "mh" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className={animationClasses.cardHover}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          Concatenated Heads (all)
                          {animationClasses.enabled && (
                            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded animate-data-flow" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <VectorTable 
                          title="[Head 0 | Head 1 | ...]" 
                          vectors={H_concat} 
                          labels={tokens.map((_t, i) => String(i))}
                        />
                      </CardContent>
                    </Card>
                    <Card className={`${animationClasses.cardHover} ${animationClasses.enabled ? 'animate-head-concat animation-delay-200' : ''}`}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          Output Projection (W₀ · concat)
                          {completedSteps?.has('mh') && animationClasses.enabled && (
                            <CheckCircle className="w-4 h-4 text-green-600 animate-celebration" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <VectorTable 
                          title="MHA Output (per token)" 
                          vectors={MHA_out} 
                          labels={tokens.map((_t, i) => String(i))}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        
        {/* Celebration Banner */}
        {_showCelebration && animationClasses.enabled && (
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 animate-celebration">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <CheckCircle className="w-8 h-8 text-green-600 animate-celebration" />
                <div className="text-2xl font-bold text-green-800">Congratulations! 🎉</div>
                <CheckCircle className="w-8 h-8 text-green-600 animate-celebration animation-delay-200" />
              </div>
              <div className="text-green-700 mb-4">
                You&apos;ve successfully explored the complete Transformer self-attention mechanism!
              </div>
              <div className="text-sm text-green-600">
                You now understand how tokens are transformed through embeddings → Q,K,V → attention scores → 
                softmax weights → weighted values → multi-head output. Try different sentences and settings to explore more!
              </div>
              
              {/* Confetti effect simulation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Resources Panel */}
        <Card className={animationClasses.cardHover}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Continue Learning</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Papers & Articles */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Essential Papers
                </h4>
                <div className="space-y-2">
                  <a 
                    href="#"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="flex items-start gap-2">
                      <ExternalLink className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Attention Is All You Need</div>
                        <div className="text-xs text-gray-600">Vaswani et al. (2017) - The original transformer paper</div>
                      </div>
                    </div>
                  </a>
                  <a 
                    href="#"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="flex items-start gap-2">
                      <ExternalLink className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">The Illustrated Transformer</div>
                        <div className="text-xs text-gray-600">Jay Alammar - Visual explanation of transformers</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Videos & Tutorials */}
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Video Tutorials
                </h4>
                <div className="space-y-2">
                  <a 
                    href="#"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="flex items-start gap-2">
                      <ExternalLink className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Attention Mechanism Explained</div>
                        <div className="text-xs text-gray-600">3Blue1Brown - Mathematical intuition</div>
                      </div>
                    </div>
                  </a>
                  <a 
                    href="#"
                    className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <div className="flex items-start gap-2">
                      <ExternalLink className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm">Transformers from Scratch</div>
                        <div className="text-xs text-gray-600">Andrej Karpathy - Code walkthrough</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Implementation Tips */}
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Implementation Notes
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-900 mb-1">PyTorch</div>
                  <div className="text-blue-800 text-xs">Use nn.MultiheadAttention() for production. Our toy implementation uses d_k=4 for visualization.</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-900 mb-1">Scaling</div>
                  <div className="text-green-800 text-xs">Real models use d_model=512-1024, heads=8-16. Attention scales as O(n²) with sequence length.</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="font-medium text-orange-900 mb-1">Optimization</div>
                  <div className="text-orange-800 text-xs">Use Flash Attention for long sequences. Layer normalization and residual connections are crucial.</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="font-medium text-purple-900 mb-1">Applications</div>
                  <div className="text-purple-800 text-xs">Used in GPT (decoder-only), BERT (encoder-only), T5 (encoder-decoder). Each has different masking.</div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Interactive Tips</h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Toggle <strong>Causal mask</strong> to see decoder vs. encoder behavior</li>
                  <li>• Click different tokens to explore attention patterns</li>
                  <li>• Try different sentences to see how context affects attention</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Increase <strong>Heads</strong> to see parallel processing</li>
                  <li>• Use the step navigator to understand the pipeline</li>
                  <li>• Switch learning modes for different detail levels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </EducationalSystem>
    </TooltipProvider>
  );
}

// Progressive UI wrapper component
// ProgressiveUIWrapper removed - functionality integrated into main component

// Main export with providers
export default function TransformerVisualizer() {
  return (
    <LearningJourneyProvider>
      <TransformerVisualizerCore />
    </LearningJourneyProvider>
  );
}
