import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal as TerminalIcon,
  Cpu,
  Code,
  Copy,
  Check,
  BookOpen,
  ShieldCheck,
  Database,
  Server,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Search,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

// Structure for a sub-heading on the active page
interface HeaderAnchor {
  id: string;
  title: string;
}

// Struct for the active docs chapter
interface DocsChapter {
  id: string;
  title: string;
  category: string;
  emoji: string;
  breadcrumbs: string[];
  anchors: HeaderAnchor[];
  previousPage: { title: string; id: string } | null;
  nextPage: { title: string; id: string } | null;
}

export default function DocsPage({
  onNavigateToDevelopers,
  onStartEarning,
}: {
  onNavigateToDevelopers: () => void;
  onStartEarning?: () => void;
}) {
  const [activeChapterId, setActiveChapterId] = useState<string>("quickstart");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<
    "helpful" | "unhelpful" | null
  >(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Comprehensive Document Chapters Data matching user requested documentation structures
  const chapters: Record<string, DocsChapter> = {
    introduction: {
      id: "introduction",
      title: "Introduction to Protocol",
      category: "Getting Started",
      emoji: "ℹ️",
      breadcrumbs: ["Docs", "Getting Started", "Introduction"],
      previousPage: null,
      nextPage: { title: "Quickstart Guide", id: "quickstart" },
      anchors: [
        { id: "overview", title: "Decentralized Acron" },
        { id: "why-protocol", title: "Why Sovereign Economics?" },
        { id: "architecture-summary", title: "Three-Tier Architecture" },
      ],
    },
    quickstart: {
      id: "quickstart",
      title: "Quickstart Guide",
      category: "Getting Started",
      emoji: "🚀",
      breadcrumbs: ["Docs", "Getting Started", "Quickstart"],
      previousPage: { title: "Introduction", id: "introduction" },
      nextPage: { title: "Core Protocol Spec", id: "core_protocol" },
      anchors: [
        { id: "env-setup", title: "Environment Setup" },
        { id: "security-note", title: "Security Note" },
        { id: "first-api-call", title: "Your First API Call" },
        { id: "api-parameters", title: "API Parameters" },
      ],
    },
    core_protocol: {
      id: "core_protocol",
      title: "Core Protocol Specifications",
      category: "Network Protocol",
      emoji: "🌐",
      breadcrumbs: ["Docs", "Core Protocol", "Specifications"],
      previousPage: { title: "Quickstart Guide", id: "quickstart" },
      nextPage: { title: "Staking API Integration", id: "staking_api" },
      anchors: [
        { id: "autonomous-multiplexing", title: "Autonomous Multiplexing" },
        { id: "verification-proofs", title: "Attestation Proofs (PoA)" },
        { id: "route-selection-rules", title: "Dynamic Cost Routing" },
      ],
    },
    staking_api: {
      id: "staking_api",
      title: "Staking & Yield SDK API",
      category: "Developers Reference",
      emoji: "🏦",
      breadcrumbs: ["Docs", "Staking API", "Integration"],
      previousPage: { title: "Core Protocol Specs", id: "core_protocol" },
      nextPage: { title: "Validator Node Setup", id: "validator_node" },
      anchors: [
        { id: "delegated-staking", title: "Delegated Staking Setup" },
        { id: "yield-yields", title: "Yield Schedules & Halving" },
        { id: "slashing-parameters", title: "Slashing Vulnerability Guide" },
      ],
    },
    validator_node: {
      id: "validator_node",
      title: "Validator Node Host Operations",
      category: "Node Operator Guide",
      emoji: "🖥️",
      breadcrumbs: ["Docs", "Validator Node", "Installation"],
      previousPage: { title: "Staking SDK API", id: "staking_api" },
      nextPage: { title: "Command Line Reference", id: "cli_reference" },
      anchors: [
        { id: "node-specs", title: "Hardware Recommendations" },
        { id: "container-daemon", title: "Docker Container daemon" },
        { id: "logs-monitoring", title: "Metrics Telemetry Export" },
      ],
    },
    cli_reference: {
      id: "cli_reference",
      title: "Command Line CLI Reference",
      category: "Developers Reference",
      emoji: "📟",
      breadcrumbs: ["Docs", "CLI Reference", "Commands"],
      previousPage: { title: "Validator Operations", id: "validator_node" },
      nextPage: { title: "TEE Security Audit", id: "security" },
      anchors: [
        { id: "cli-install", title: "CLI Shell Installation" },
        { id: "auth-cmds", title: "Authentication Commands" },
        { id: "node-diagnostic-cmds", title: "Diagnostics Commands" },
      ],
    },
    security: {
      id: "security",
      title: "TEE & Cryptographic Security",
      category: "Sovereign Engineering",
      emoji: "🛡️",
      breadcrumbs: ["Docs", "Security", "Hardware Attestation"],
      previousPage: { title: "CLI Command Reference", id: "cli_reference" },
      nextPage: null,
      anchors: [
        { id: "tee-attestation", title: "Remote Attestation Handshake" },
        { id: "amd-intel-isolation", title: "AMD SEV / Intel SGX" },
        { id: "private-key-isolation", title: "Hardware Security Modules" },
      ],
    },
  };

  // Filter Chapters based on Search query
  const sidebarItems = [
    { id: "introduction", label: "Introduction", category: "Getting Started" },
    {
      id: "quickstart",
      label: "Quickstart Guide",
      category: "Getting Started",
    },
    {
      id: "core_protocol",
      label: "Core Protocol",
      category: "Network Protocol",
    },
    {
      id: "staking_api",
      label: "Staking API",
      category: "Developers Reference",
    },
    {
      id: "validator_node",
      label: "Validator Node",
      category: "Node Operator",
    },
    {
      id: "cli_reference",
      label: "CLI Reference",
      category: "Developers Reference",
    },
    {
      id: "security",
      label: "Security & HSM",
      category: "Sovereign Engineering",
    },
  ];

  // Group chapters for sidebar rendering
  const categories = [
    "Getting Started",
    "Network Protocol",
    "Developers Reference",
    "Node Operator",
    "Sovereign Engineering",
  ];

  const currentChapter = chapters[activeChapterId] || chapters.quickstart;

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-brand-dark flex flex-col justify-between relative">
      {/* Search Header banner */}
      <div className="border-b border-brand-light-beige/30 bg-white/40 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs text-brand-green font-semibold uppercase bg-brand-green-bg/25 px-2.5 py-1 rounded">
              V2.0.4-STABLE
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              LATEST SECURE SPEC
            </span>
          </div>

          {/* Docs specific search filter */}
          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-brand-light-beige font-sans text-xs pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-brand-green text-brand-dark focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* ======================================= */}
        {/* LEFT COLUMN: Sidebar Navigation Panel (3 cols) */}
        {/* ======================================= */}
        <aside className="lg:col-span-3 space-y-8 select-none border-b lg:border-b-0 lg:border-r border-brand-light-beige/30 pb-6 lg:pb-0 lg:pr-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 justify-between lg:justify-start">
              <h2 className="font-display font-medium text-lg text-brand-dark flex items-center gap-2">
                <BookOpen size={18} className="text-brand-green" />
                Documentation
              </h2>
              <span className="text-[10px] font-mono font-medium text-zinc-400 uppercase bg-zinc-200/50 px-1.5 py-0.5 rounded">
                v2.0
              </span>
            </div>

            {/* Structured categories nested loops */}
            <div className="space-y-6 text-left">
              {categories.map((cat) => {
                const itemsInCat = sidebarItems.filter(
                  (item) => item.category === cat,
                );
                if (itemsInCat.length === 0) return null;

                return (
                  <div key={cat} className="space-y-1.5">
                    <span className="font-label-caps text-[9.5px] tracking-widest text-zinc-400 font-bold block uppercase">
                      {cat}
                    </span>
                    <div className="space-y-0.5">
                      {itemsInCat.map((item) => {
                        const isSelected = activeChapterId === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveChapterId(item.id);
                              // Smooth scroll browser to top of document active workspace
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`w-full text-[12.5px] py-1.5 px-3 rounded-lg flex items-center justify-between text-left font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "bg-white text-brand-green border-l-2 border-brand-green shadow-xs font-semibold"
                                : "text-brand-gray hover:text-brand-dark hover:bg-white/40"
                            }`}
                          >
                            <span>{item.label}</span>
                            {isSelected && (
                              <ChevronRight
                                size={12}
                                className="text-brand-green"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary support assets link cards */}
          <div className="bg-white border border-brand-light-beige/60 p-4 rounded-2xl space-y-3.5 shadow-xs text-left">
            <h4 className="font-body-sm font-semibold text-brand-dark text-xs select-none">
              Technical Support
            </h4>
            <div className="space-y-2 text-[12px] text-brand-gray">
              <p className="leading-relaxed">
                Need real-time architectural deployment help or found an attest
                issue?
              </p>

              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => onStartEarning?.()}
                  className="w-full text-center py-2 bg-brand-green/5 text-brand-green rounded-lg hover:bg-brand-green-bg/25 font-label-caps text-[10px] tracking-wider transition-all cursor-pointer block uppercase font-bold"
                >
                  Join Community Discord
                </button>
                <button
                  onClick={onNavigateToDevelopers}
                  className="w-full text-center py-2 border border-brand-light-beige text-brand-gray rounded-lg hover:bg-brand-cream font-label-caps text-[10px] tracking-wider transition-all cursor-pointer block uppercase font-bold"
                >
                  Developer Playground
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ======================================= */}
        {/* CENTER COLUMN: Document Rich Content Area (6 cols) */}
        {/* ======================================= */}
        <main className="lg:col-span-6 space-y-12 text-left min-h-[600px] bg-white rounded-3xl p-6 md:p-10 border border-brand-light-beige/50 shadow-sm leading-relaxed">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Breadcrumb path */}
              <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px] select-none">
                {currentChapter.breadcrumbs.map((crumb, idx) => (
                  <span key={crumb} className="flex items-center gap-1.5">
                    {idx > 0 && <span>/</span>}
                    <span
                      className={
                        idx === currentChapter.breadcrumbs.length - 1
                          ? "text-brand-green font-semibold"
                          : ""
                      }
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </div>

              {/* Page Main Heading */}
              <div>
                <h1 className="font-display-lg text-brand-dark text-4xl tracking-tighter mb-2 leading-none">
                  {currentChapter.emoji} {currentChapter.title}
                </h1>
                <p className="font-body-md text-brand-gray text-[14.5px]">
                  Official protocols integration manual for{" "}
                  {currentChapter.title}. Learn specs, security policies and
                  structures.
                </p>
              </div>

              {/* ================================== */}
              {/* RENDER DYNAMIC CONTENT BASED ON SECTION ID */}
              {/* ================================== */}

              {/* 1. INTRODUCTION MANUAL */}
              {currentChapter.id === "introduction" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14.5px] leading-relaxed">
                  <section id="overview" className="scroll-mt-16 space-y-4">
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Decentralized Acron
                    </h3>
                    <p>
                      Welcome to the Decentralized Compute & Routing Protocol.
                      The platform functions as an automated,
                      institutional-grade supply multiplexer. It maps acron
                      compute clusters, REST API endpoints, autonomous software
                      agents, and hot archival storage arrays into an unified
                      on-chain settlement network.
                    </p>
                    <p>
                      Rather than paying legacy cloud providers exorbitant
                      premiums for oversized static allocations, developers
                      leverage our gateway to dispatch tasks containerized
                      inside fully attested enclaves. Compute providers
                      automatically earn micro-rewards settling directly onto
                      our high-speed Solana ledger.
                    </p>
                  </section>

                  <section id="why-protocol" className="scroll-mt-16 space-y-4">
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Why Sovereign Economics?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="p-4 bg-brand-cream/40 border border-brand-light-beige/35 rounded-xl space-y-2">
                        <span className="font-bold text-zinc-900 block text-[13px] uppercase">
                          Micro-settlement
                        </span>
                        <p className="text-zinc-600 text-xs leading-relaxed">
                          By routing payments onto decentralized high-frequency
                          nodes, operations settle as quickly as 40
                          microseconds, bypassing monthly invoices entirely.
                        </p>
                      </div>
                      <div className="p-4 bg-brand-cream/40 border border-brand-light-beige/35 rounded-xl space-y-2">
                        <span className="font-bold text-zinc-900 block text-[13px] uppercase">
                          Confidential Computing
                        </span>
                        <p className="text-zinc-600 text-xs leading-relaxed">
                          Every dispatch query runs securely inside a certified
                          Hardware Secure Enclave (Intel SGX / AMD SEV),
                          guaranteeing that node operators never read raw code
                          weights or dataset payloads.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section
                    id="architecture-summary"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Three-Tier Decentralized Grid
                    </h3>
                    <p>
                      The network topology utilizes three dynamic protocol
                      layers to sustain high-availability:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2 text-zinc-600 text-xs">
                      <li>
                        <strong>The Client Layer (SDK Gateway)</strong>: High
                        performance libraries in Rust, Node, Go, and Python to
                        package, sign, and dispatch request tasks securely.
                      </li>
                      <li>
                        <strong>The Cryptographic Attestation Indexer:</strong>{" "}
                        A zero-latency, globally replicated directory confirming
                        TEE remote credentials, latency logs, and network
                        connection parameters.
                      </li>
                      <li>
                        <strong>The Node Execution Layer:</strong> Physical
                        servers globally hosting enclaved daemons executing
                        computations.
                      </li>
                    </ol>
                  </section>
                </div>
              )}

              {/* 2. QUICKSTART GUIDE (Matches User's reference exactly) */}
              {currentChapter.id === "quickstart" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14px]">
                  <p className="leading-relaxed text-[14.5px]">
                    Welcome to the protocol developer guides. This page will
                    help you set up your local development environment and make
                    your first authenticated request to our decentralized acron
                    layer. We prioritize low-latency and institutional-grade
                    security for all node interactions.
                  </p>

                  <section id="env-setup" className="scroll-mt-16 space-y-3.5">
                    <h3 className="font-display font-semibold text-brand-dark text-lg md:text-xl tracking-tight">
                      Environment Setup
                    </h3>
                    <p className="leading-relaxed">
                      Before beginning, ensure you have Node.js version 18 or
                      higher installed on your machine. You will also need a
                      valid API key from your Developer Operations Dashboard.
                    </p>

                    {/* Code block */}
                    <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 relative group text-left">
                      <span className="text-[10px] text-zinc-500 font-mono block select-none mb-1">
                        # Install the official Core SDK
                      </span>
                      <pre className="text-emerald-400 font-mono text-[12.5px] select-all leading-normal">
                        <code>npm install @infra-protocol/sdk</code>
                      </pre>
                      <button
                        onClick={() =>
                          handleCopy(
                            "npm install @infra-protocol/sdk",
                            "qsInstall",
                          )
                        }
                        className="absolute right-3.5 top-3.5 p-1 px-2 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded text-[10px] hover:text-white transition-all cursor-pointer"
                      >
                        {copiedId === "qsInstall" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </section>

                  {/* Security Note Alert block */}
                  <section
                    id="security-note"
                    className="scroll-mt-16 bg-[#eef7f2] border-l-4 border-brand-green p-4.5 rounded-r-xl space-y-1"
                  >
                    <div className="flex items-center gap-2 text-brand-green mb-1 font-semibold text-xs uppercase tracking-wider">
                      <ShieldCheck size={16} />
                      <span>Security Note</span>
                    </div>
                    <p className="text-brand-green-light text-xs font-medium leading-relaxed">
                      Never expose your secret keys or environment variables in
                      client-side code. The protocol requires all production
                      calls to be signed through a secure back-end environment
                      or a trusted hardware security module (HSM).
                    </p>
                  </section>

                  {/* Your First API Call */}
                  <section
                    id="first-api-call"
                    className="scroll-mt-16 space-y-3.5"
                  >
                    <h3 className="font-display font-semibold text-brand-dark text-lg md:text-xl tracking-tight">
                      Your First API Call
                    </h3>
                    <p className="leading-relaxed">
                      The following code snippet demonstrates how to initialize
                      the client and fetch the current state metrics of a
                      physical validator node:
                    </p>

                    <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 relative group text-left">
                      <pre className="text-emerald-400 font-mono text-[12px] select-all leading-relaxed whitespace-pre overflow-x-auto">
                        {`import { ProtocolClient } from '@infra-protocol/sdk';

const client = new ProtocolClient({
  apiKey: process.env.INFRA_API_KEY,
  environment: 'mainnet'
});

const stats = await client.nodes.getStats('node_v1_082');
console.log('Node Status:', stats.health);`}
                      </pre>
                      <button
                        onClick={() =>
                          handleCopy(
                            `import { ProtocolClient } from '@infra-protocol/sdk';\n\nconst client = new ProtocolClient({\n  apiKey: process.env.INFRA_API_KEY,\n  environment: 'mainnet'\n});\n\nconst stats = await client.nodes.getStats('node_v1_082');\nconsole.log('Node Status:', stats.health);`,
                            "qsCode",
                          )
                        }
                        className="absolute right-3.5 top-3.5 p-1 px-2 bg-zinc-900 border border-zinc-850 text-zinc-400 rounded text-[10px] hover:text-white transition-all cursor-pointer"
                      >
                        {copiedId === "qsCode" ? "COPIED" : "COPY"}
                      </button>
                    </div>
                  </section>

                  {/* API Parameters Table */}
                  <section
                    id="api-parameters"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-semibold text-brand-dark text-lg md:text-xl tracking-tight">
                      API Parameters
                    </h3>
                    <div className="overflow-x-auto border border-brand-light-beige rounded-xl">
                      <table className="w-full text-left font-sans text-xs border-collapse">
                        <thead>
                          <tr className="bg-brand-cream border-b border-brand-light-beige text-brand-gray font-bold">
                            <th className="p-3">PARAMETER</th>
                            <th className="p-3">TYPE</th>
                            <th className="p-3">DESCRIPTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-light-beige bg-white text-zinc-700">
                          <tr className="hover:bg-brand-cream/40">
                            <td className="p-3 font-mono font-bold text-brand-dark">
                              apiKey
                            </td>
                            <td className="p-3 font-mono text-indigo-600">
                              String
                            </td>
                            <td className="p-3">
                              Unique identifier for your project. Located inside
                              key dashboard.
                            </td>
                          </tr>
                          <tr className="hover:bg-brand-cream/40">
                            <td className="p-3 font-mono font-bold text-brand-dark">
                              environment
                            </td>
                            <td className="p-3 font-mono text-rose-600">
                              Enum
                            </td>
                            <td className="p-3">
                              Target network region:{" "}
                              <code className="bg-zinc-100 p-0.5 rounded text-rose-600 font-mono font-semibold">
                                'mainnet'
                              </code>{" "}
                              or{" "}
                              <code className="bg-zinc-100 p-0.5  rounded text-rose-600 font-mono font-semibold">
                                'testnet'
                              </code>
                              .
                            </td>
                          </tr>
                          <tr className="hover:bg-brand-cream/40">
                            <td className="p-3 font-mono font-bold text-brand-dark">
                              timeout
                            </td>
                            <td className="p-3 font-mono text-emerald-600">
                              Number
                            </td>
                            <td className="p-3">
                              Request gateway timeout in milliseconds (default:
                              5000ms).
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {/* 3. CORE PROTOCOL */}
              {currentChapter.id === "core_protocol" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14.5px]">
                  <section
                    id="autonomous-multiplexing"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Autonomous Multiplexing
                    </h3>
                    <p>
                      The Core multiplexer splits monolithic client API requests
                      across multiple low-latency hardware channels. Overload
                      thresholds trigger dynamic connection rerouting, meaning
                      tasks scale horizontally without operator intervention.
                    </p>
                    <p>
                      The routing process negotiates cost barriers using deep
                      Dijkstra heuristic indices, settling rewards instantly to
                      active validator host addresses.
                    </p>
                  </section>

                  <section
                    id="verification-proofs"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Proofs of Attestation (PoA)
                    </h3>
                    <p>
                      Rather than inefficient proof-of-work mining, physical
                      operators run cryptographic Remote Attestation proofs
                      inside CPU co-processes. Every session must register an
                      Intel SGX or AMD SEV isolation certificate to confirm code
                      hasn't been intercepted:
                    </p>
                    {/* Visual box of verified flow */}
                    <div className="p-4.5 bg-brand-cream rounded-xl border border-brand-light-beige/35 font-mono text-[11.5px] text-zinc-600 space-y-1">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />{" "}
                        1. Guest Operator deploys enclave binary
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full" />{" "}
                        2. TEE CPU writes hash register (MRENCLAVE)
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full" />{" "}
                        3. Decentralized Indexer validates cryptographic
                        signature
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />{" "}
                        4. Handshake complete: Node gains active routing status
                      </p>
                    </div>
                  </section>

                  <section
                    id="route-selection-rules"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Heuristic Route Cost Rules
                    </h3>
                    <p>
                      Routing path calculations consider the following heavy
                      parameters:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-600 text-xs text-left">
                      <li>
                        <strong>Network Telemetry Ping:</strong> Nodes exceeding
                        150ms are temporarily demoted from high-priority queues.
                      </li>
                      <li>
                        <strong>Declared Pricing Rate:</strong> Developers
                        specify maximum routing budget limits ($USD per unit).
                      </li>
                      <li>
                        <strong>Hardware Reliability:</strong> Historical node
                        uptime metrics directly scale priority indexes.
                      </li>
                    </ul>
                  </section>
                </div>
              )}

              {/* 4. STAKING API */}
              {currentChapter.id === "staking_api" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14.5px]">
                  <section
                    id="delegated-staking"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Delegated Staking Integration
                    </h3>
                    <p>
                      Protocol security is bolstered byDelegated Proof-of-Stake
                      (dPoS). Token operators delegate native tokens to verified
                      high-performance hardware hosts, enabling hosts to score
                      higher in routing queues and splitting aggregate yields.
                    </p>

                    <div className="p-4 bg-zinc-950 rounded-xl relative text-left font-mono text-[12px] text-emerald-400 border border-white/5 whitespace-pre overflow-x-auto">
                      {`import { StakingClient } from '@infra-protocol/sdk';\n\nconst client = new StakingClient({ apiKey: 'YOUR_KEY' });\n\n// Delegate native tokens to specific enclaved host\nconst delegation = await client.stake.delegate({\n  nodeId: 'INF-3011-XP',\n  amountInTokens: 15000,\n  compoundYield: true\n});\nconsole.log('Delegation TX Ledger Reference:', delegation.transactionId);`}
                    </div>
                  </section>

                  <section id="yield-yields" className="scroll-mt-16 space-y-4">
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Yield Schedules & Halving
                    </h3>
                    <p>
                      Total network delegation yield scales with active
                      throughput volume. Base operators earn 8.2% APY in
                      protocol tokens, compounding dynamically on a epoch
                      interval (roughly every 5 days). Rewards are subject to
                      automatic 15% halving loops when network capacity
                      thresholds exceed 1,000 active Petabytes.
                    </p>
                  </section>

                  <section
                    id="slashing-parameters"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Slashing Conditions
                    </h3>
                    <p>
                      To guarantee physical uptime and defend against malicious
                      spoofed routers, delegated assets undergo automatic
                      on-chain slashing penalties:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-650 text-xs">
                      <li>
                        <strong>Uptime Drop-out:</strong> Drop of node uptime
                        below 95% triggers an immediate 0.1% staked asset
                        warning slash.
                      </li>
                      <li>
                        <strong>Double Routing Fraud:</strong> Handshaking
                        conflicting endpoints with identical cryptographic
                        frames results in general 15% slashing and permanent
                        node blacklist.
                      </li>
                    </ul>
                  </section>
                </div>
              )}

              {/* 5. VALIDATOR NODE SETUP */}
              {currentChapter.id === "validator_node" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14.5px]">
                  <section id="node-specs" className="scroll-mt-16 space-y-4">
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Hardware Recommendations
                    </h3>
                    <p>
                      Physical validator hosts must satisfy strict hardware
                      minimums to successfully process secure routing:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-zinc-600 text-xs text-left">
                      <li>
                        <strong>CPU</strong>: AMD EPYC Core 7003 series or Intel
                        Xeon Scalable Ice Lake (enclave SGX certified).
                      </li>
                      <li>
                        <strong>RAM:</strong> Minimum 64GB DDR4 ECC Memory (with
                        PRM allocation set to 32GB mínimo).
                      </li>
                      <li>
                        <strong>Connection:</strong> Dedicated Gigabit fiber
                        optic channel (1 Gbps symmetric) with static public IP.
                      </li>
                      <li>
                        <strong>Storage:</strong> Enterprise isolated SSD array
                        with 500GB available capacity.
                      </li>
                    </ul>
                  </section>

                  <section
                    id="container-daemon"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Docker Container daemon
                    </h3>
                    <p>
                      To deploy a secure computing daemon on clean Ubuntu Linux
                      systems, run the following official Docker container image
                      command:
                    </p>

                    <div className="p-4 bg-zinc-950 rounded-xl relative text-left font-mono text-[12px] text-emerald-400 border border-white/5 whitespace-pre overflow-x-auto">
                      {`docker run -d \\
  --name=acron-node-daemon \\
  -e WALLET="2mGq9ADBQB52bkHocoKW1s92uuXCFV3ep3ngKiZAWtHj" \\
  acronprotocol/node:v0.4.2 \\
  acron-node start --wallet 2mGq9ADBQB52bkHocoKW1s92uuXCFV3ep3ngKiZAWtHj`}
                    </div>
                  </section>

                  <section
                    id="logs-monitoring"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Metrics Telemetry and Log Exports
                    </h3>
                    <p>
                      Active operators bind telemetry streams to Prometheus or
                      Datadog export targets. Metrics expose core parameters
                      including hardware temperature, poll rates, active IO
                      throughput, and processed jobs transactions.
                    </p>
                  </section>
                </div>
              )}

              {/* 6. CLI REFERENCE */}
              {currentChapter.id === "cli_reference" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14.5px]">
                  <section id="cli-install" className="scroll-mt-16 space-y-4">
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      CLI Shell Installation
                    </h3>
                    <p>
                      Command Line utilities allow operators to manage and run
                      diagnostics directly from a Unix terminal process:
                    </p>

                    <div className="p-4 bg-zinc-950 rounded-xl relative text-left font-mono text-[12.5px] text-emerald-400 border border-white/5 whitespace-pre">
                      <code>
                        curl -sSL https://cli.acronprotocol.dev/install.sh | sh
                      </code>
                    </div>
                  </section>

                  <section id="auth-cmds" className="scroll-mt-16 space-y-4">
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Authentication Commands
                    </h3>
                    <p>
                      Command templates to authenticate your CLI binaries with
                      global developer indices:
                    </p>
                    <div className="space-y-3 font-mono text-xs text-zinc-600">
                      <p className="bg-brand-cream/60 p-3 rounded-lg border border-brand-light-beige/30">
                        <strong className="text-zinc-950 block mb-1">
                          acron-node auth login
                        </strong>
                        Initialize browser validation handshake flow and
                        authorize locally on device.
                      </p>
                      <p className="bg-brand-cream/60 p-3 rounded-lg border border-brand-light-beige/30">
                        <strong className="text-zinc-950 block mb-1">
                          acron-node start --wallet [your_wallet_address]
                        </strong>
                        Spin up the computing execution daemon linked to your
                        decentralized earnings payout wallet.
                      </p>
                    </div>
                  </section>

                  <section
                    id="node-diagnostic-cmds"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Diagnostics Commands
                    </h3>
                    <div className="space-y-3 font-mono text-xs text-zinc-700">
                      <p className="bg-brand-cream/60 p-3 rounded-lg border border-brand-light-beige/30">
                        <strong className="text-zinc-950 block mb-1">
                          acron-node status
                        </strong>
                        Query realtime hardware metrics, network latency, active
                        task types, and total jobs compiled.
                      </p>
                      <p className="bg-brand-cream/60 p-3 rounded-lg border border-brand-light-beige/30">
                        <strong className="text-zinc-950 block mb-1">
                          acron-node stop
                        </strong>
                        Trigger a graceful shutdown sequence to clean up
                        concurrent threads and persist unclaimed micro-yields.
                      </p>
                    </div>
                  </section>
                </div>
              )}

              {/* 7. SECURITY */}
              {currentChapter.id === "security" && (
                <div className="space-y-8 font-sans text-zinc-700 text-[14.5px]">
                  <section
                    id="tee-attestation"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      Remote Attestation Handshake
                    </h3>
                    <p>
                      Every API gateway or cluster operator transaction must
                      submit remote attestation signatures to ensure nodes
                      construct a trusted network boundary. Physical CPUs
                      dynamically generate asymmetric key structures tied to
                      secure enclave micro-states.
                    </p>
                    <p>
                      Remote attestations verify that the code running inside
                      the host is exactly the compiled open-source binary,
                      completely protecting from code modification or payload
                      hijacking.
                    </p>
                  </section>

                  <section
                    id="amd-intel-isolation"
                    className="scroll-mt-16 space-y-4"
                  >
                    <h3 className="font-display font-medium text-brand-dark text-xl tracking-tight border-b border-zinc-100 pb-2">
                      AMD SEV-SNP & Intel SGX
                    </h3>
                    <p>
                      By supporting both major CPU enclaved architectures, the
                      grid manages deep virtual memory isolates:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans">
                      <div className="p-4 border border-brand-light-beige rounded-xl bg-white space-y-2">
                        <span className="font-bold text-zinc-900 block text-[13px] uppercase">
                          Intel SGX Enclaves
                        </span>
                        <p className="text-zinc-600 text-xs">
                          Provides application-layer micro-isolation. Code
                          chunks and specific memory pages run protected inside
                          Hardware Enclave boundaries.
                        </p>
                      </div>
                      <div className="p-4 border border-brand-light-beige rounded-xl bg-white space-y-2">
                        <span className="font-bold text-zinc-900 block text-[13px] uppercase">
                          AMD SEV-SNP Isolation
                        </span>
                        <p className="text-zinc-600 text-xs">
                          Utilizes nested paging with absolute physical
                          encryption. Protects complete container machine
                          hypervisors from host operating systems.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* ================================== */}
              {/* END DYNAMIC CONTENT SECTIONS */}
              {/* ================================== */}

              {/* Helper rating & feedback elements */}
              <div className="mt-16 pt-8 border-t border-brand-light-beige select-none flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h5 className="font-body-sm font-semibold text-brand-dark text-xs">
                    Was this documentation page helpful?
                  </h5>
                  <p className="text-[11.5px] text-zinc-400 mt-0.5">
                    Help us polish our sovereign developer books.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!feedbackSent ? (
                    <>
                      <button
                        onClick={() => {
                          setFeedbackSent(true);
                          setFeedbackType("helpful");
                        }}
                        className="p-2 py-1.5 border border-brand-light-beige rounded-lg hover:bg-brand-cream text-zinc-500 hover:text-brand-dark flex items-center gap-1.5 text-[11.5px] cursor-pointer font-medium"
                      >
                        <ThumbsUp size={12} />
                        Yes
                      </button>
                      <button
                        onClick={() => {
                          setFeedbackSent(true);
                          setFeedbackType("unhelpful");
                        }}
                        className="p-2 py-1.5 border border-brand-light-beige rounded-lg hover:bg-brand-cream text-zinc-500 hover:text-brand-dark flex items-center gap-1.5 text-[11.5px] cursor-pointer font-medium"
                      >
                        <ThumbsDown size={12} />
                        No
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-brand-green flex items-center gap-1.5 bg-brand-green-bg/25 px-3 py-1.5 rounded-lg">
                      <Check size={13} />
                      {feedbackType === "helpful"
                        ? "Thanks for your vote!"
                        : "We will review this template."}
                    </span>
                  )}
                </div>
              </div>

              {/* Pager bottom switches Previous / Next Page */}
              <div className="pt-8 border-t border-brand-cream select-none grid grid-cols-2 gap-4">
                {currentChapter.previousPage ? (
                  <button
                    onClick={() => {
                      setActiveChapterId(currentChapter.previousPage!.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-4 border border-brand-light-beige/80 rounded-2xl text-left bg-brand-cream/35 hover:bg-brand-cream hover:border-brand-green/30 transition-all flex items-start gap-3 cursor-pointer group"
                  >
                    <ArrowLeft
                      size={16}
                      className="text-zinc-400 group-hover:-translate-x-1.5 transition-transform mt-0.5 shrink-0"
                    />
                    <div>
                      <span className="text-[9.5px] font-label-caps text-zinc-400 font-bold block">
                        PREVIOUS
                      </span>
                      <span className="font-body-sm font-semibold text-brand-dark text-xs group-hover:text-brand-green transition-colors leading-tight block mt-0.5">
                        {currentChapter.previousPage.title}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div />
                )}

                {currentChapter.nextPage ? (
                  <button
                    onClick={() => {
                      setActiveChapterId(currentChapter.nextPage!.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="p-4 border border-brand-light-beige/30 rounded-2xl text-right bg-brand-cream/35 hover:bg-brand-cream hover:border-brand-green/30 transition-all flex items-start justify-end gap-3 cursor-pointer group text-right"
                  >
                    <div className="text-right">
                      <span className="text-[9.5px] font-label-caps text-zinc-400 font-bold block">
                        UP NEXT
                      </span>
                      <span className="font-body-sm font-semibold text-brand-dark text-xs group-hover:text-brand-green transition-colors leading-tight block mt-0.5">
                        {currentChapter.nextPage.title}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-zinc-400 group-hover:translate-x-1.5 transition-transform mt-0.5 shrink-0"
                    />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ======================================= */}
        {/* RIGHT COLUMN: Table of Contents & Helpful Links (3 cols) */}
        {/* ======================================= */}
        <aside className="lg:col-span-3 space-y-6 select-none sticky top-24 text-left">
          {/* Active section Anchors loop */}
          <div className="bg-white p-5 border border-brand-light-beige/60 rounded-2xl space-y-4 shadow-xs">
            <span className="font-label-caps text-[10px] tracking-widest text-[#a8a18f] font-bold block uppercase pb-1 border-b border-zinc-100">
              ON THIS PAGE
            </span>
            <div className="space-y-2">
              {currentChapter.anchors.map((anchor) => (
                <a
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(anchor.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block text-[12px] text-brand-gray hover:text-brand-green transition-colors font-medium hover:pl-1"
                >
                  {anchor.title}
                </a>
              ))}
            </div>
          </div>

          {/* Quick specs helper dashboard cards (matches visual preview on right) */}
          <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-3xl text-left space-y-4 bg-[linear-gradient(to_bottom,rgba(25,25,25,0.7),transparent)] text-white relative overflow-hidden group">
            {/* Ambient vector visual layer */}
            <div
              className="absolute inset-0 bg-opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#105340 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="relative z-10 space-y-3">
              <span className="font-label-caps text-[9px] text-zinc-400 font-bold block">
                ECOSYSTEM BROADCAST
              </span>
              <h5 className="font-body-sm font-semibold text-sm leading-snug">
                Explore our Global Node Network Map
              </h5>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Observe live AMD SEV-SNP cryptographic attestation tunnels,
                hardware VRAM temperatures, and dynamic micro-bills in realtime
                across 18 continents.
              </p>

              <button
                onClick={() => onStartEarning?.()}
                className="w-full py-2 bg-brand-green hover:bg-brand-green-light text-white rounded-lg font-label-caps text-[10px] tracking-wider transition-all cursor-pointer block uppercase font-bold text-center"
              >
                Launch Telemetry Map
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
