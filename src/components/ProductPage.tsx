import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Database,
  Activity,
  Check,
  ChevronRight,
  Terminal as TerminalIcon,
  Info,
  RefreshCw,
  Play,
  ArrowRight,
  Lock,
  Server,
  Workflow,
} from "lucide-react";

export default function ProductPage({
  onStartEarning,
  onNavigateToDocs,
}: {
  onStartEarning: () => void;
  onNavigateToDocs?: () => void;
}) {
  // Explainer Tabs: routing, tee, ledger
  const [activeExplainTab, setActiveExplainTab] = useState<
    "routing" | "tee" | "ledger"
  >("routing");

  // Selected GPU for details
  const [selectedGpu, setSelectedGpu] = useState<string>("h100");

  // Latency simulation text/steps
  const [testNodeIp, setTestNodeIp] = useState<string>("192.168.100.41");
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measuredLatency, setMeasuredLatency] = useState<string | null>(null);

  const runLatencyTest = () => {
    setIsMeasuring(true);
    setMeasuredLatency(null);
    setTimeout(() => {
      setIsMeasuring(false);
      setMeasuredLatency((Math.random() * 0.15 + 0.18).toFixed(3) + " ms");
    }, 1200);
  };

  const gpuSpecs = {
    h100: {
      name: "NVIDIA H100 Tensor Core",
      vram: "80GB SXM5",
      payoutRate: "$1.45 / hr",
      routingLoad: "92% global active bias",
      attestation: "Hardware Identity Key (Intel Trust Domain Extension)",
      optimalTask:
        "Generative LLM Fine-Tuning & High-Throughput Batch Inference",
    },
    a100: {
      name: "NVIDIA A100 Standard PCIe",
      vram: "40GB / 80GB HBM2",
      payoutRate: "$0.84 / hr",
      routingLoad: "78% bias",
      attestation: "Platform Attestation Token (AMD SEV-SNP Certified)",
      optimalTask: "Vision-Language Routing & Audio processing workloads",
    },
    l40s: {
      name: "NVIDIA L40S Global Core",
      vram: "48GB GDDR6",
      payoutRate: "$0.68 / hr",
      routingLoad: "84% stable",
      attestation: "Secure Enclave Module V4",
      optimalTask: "Distributed Caching & High-Density Webhook Forwarding",
    },
    cpu: {
      name: "Xeon Gold Host Multi-Thread",
      vram: "256GB CPU Cache Proxy",
      payoutRate: "$0.18 / hr",
      routingLoad: "25% acron",
      attestation: "TPM 2.0 Chip Signature",
      optimalTask:
        "Micro-API relaying, low-frequency IPFS caching, metadata registries",
    },
  };

  return (
    <div className="w-full flex flex-col text-left">
      {/* Product Hero */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            CORE DEEP TECH CAPABILITIES
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            The low-latency routing{" "}
            <span className="text-brand-green-light block italic font-medium mt-1">
              layer for global compute.
            </span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-10 leading-relaxed">
            Our technology abstracts physical machines into a single, fluid
            routing network. Secure enclaves certify the integrity of node
            environments while Solana handles high-frequency micropayout
            settlement.
          </p>
        </div>
      </section>

      {/* Interactive Core Explainer Tabs */}
      <section className="py-16 px-6 bg-brand-cream/60 border-y border-brand-light-beige/30 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 border-b border-brand-light-beige/40 pb-6">
            <div>
              <p className="font-label-caps text-brand-gray tracking-wider text-[11px] mb-2">
                SYSTEM INTERACTION PROTOCOLS
              </p>
              <h2 className="font-display-md text-brand-dark tracking-tight">
                How the Architecture Operates
              </h2>
            </div>

            {/* Nav tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  id: "routing",
                  label: "01. ADAPTIVE ROUTING",
                  icon: Workflow,
                },
                { id: "tee", label: "02. SECURE ENCLAVES (TEE)", icon: Lock },
                {
                  id: "ledger",
                  label: "03. MICRO-LEDGER SETTLEMENT",
                  icon: Database,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveExplainTab(tab.id as any)}
                    className={`font-label-caps text-[11px] tracking-wider px-4 py-3 rounded-lg border flex items-center gap-2 transition-all cursor-pointer ${
                      activeExplainTab === tab.id
                        ? "bg-brand-green text-white border-brand-green"
                        : "border-brand-light-beige hover:border-brand-gray/50 text-brand-dark bg-white"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual simulation column (Left component/diagram) */}
            <div className="lg:col-span-5 bg-white border border-brand-light-beige rounded-[24px] p-6 h-[400px] flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-center text-xs font-mono text-brand-gray border-b border-brand-cream pb-3 select-none">
                <span className="font-label-caps text-[10px] flex items-center gap-1.5">
                  <Activity
                    size={12}
                    className="text-brand-green animate-pulse"
                  />{" "}
                  SIMULATION DECK V4
                </span>
                <span className="text-[10px] uppercase font-bold text-brand-green-light">
                  Enclave status: PASS
                </span>
              </div>

              <div className="flex-grow flex items-center justify-center relative">
                {activeExplainTab === "routing" && (
                  <div className="w-full flex flex-col items-center gap-8">
                    {/* Routing Diagram Visualizer */}
                    <div className="flex items-center gap-12 relative w-full justify-center">
                      <div className="w-14 h-14 bg-brand-cream border border-brand-light-beige text-brand-dark font-mono rounded-xl flex flex-col items-center justify-center text-xs shadow-sm">
                        <Cpu size={18} className="text-brand-green" />
                        <span className="text-[8px] mt-1">A100</span>
                      </div>
                      <div className="h-[1px] bg-dashed border-b border-dashed border-brand-green/45 w-16 relative">
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-green animate-[ping_2s_infinite]" />
                      </div>
                      <div className="w-16 h-16 bg-brand-green text-white rounded-full flex flex-col items-center justify-center shadow-lg animate-soft-pulse">
                        <RefreshCw
                          size={18}
                          className="animate-spin"
                          style={{ animationDuration: "12s" }}
                        />
                        <span className="text-[7px] font-bold mt-1">PROXY</span>
                      </div>
                      <div className="h-[1px] bg-dashed border-b border-dashed border-brand-green/45 w-16 relative">
                        <span className="absolute -top-1.5 left-1/3 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-green-light animate-pulse" />
                      </div>
                      <div className="w-14 h-14 bg-brand-cream border border-brand-light-beige text-brand-dark font-mono rounded-xl flex flex-col items-center justify-center text-xs shadow-sm">
                        <Server size={18} className="text-brand-green-light" />
                        <span className="text-[8px] mt-1">CLIENT</span>
                      </div>
                    </div>
                    <div className="text-center font-mono text-[10px] text-zinc-500 bg-brand-cream px-3 py-1.5 rounded-lg border border-brand-light-beige/30 w-fit">
                      DYNAMIC MULTIPATH LOAD-BALANCERS ONLINE
                    </div>
                  </div>
                )}

                {activeExplainTab === "tee" && (
                  <div className="w-full flex flex-col items-center gap-5">
                    {/* Ring Isolation Representation */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-dashed border-brand-green/40 animate-[spin_40s_linear_infinite]" />
                      <div className="absolute inset-3 rounded-full border border-brand-green-bg/65 flex items-center justify-center" />
                      <div className="w-20 h-20 bg-brand-green text-white rounded-full flex flex-col items-center justify-center shadow-md relative z-10">
                        <Lock size={24} />
                        <span className="text-[8px] font-label-caps mt-1 tracking-wider">
                          SECURE TEE
                        </span>
                      </div>
                    </div>
                    <p className="font-mono text-[10px] text-brand-green bg-brand-green-bg/20 px-3 py-1 rounded uppercase tracking-wider font-semibold">
                      Cryptographic Handshake Verified
                    </p>
                  </div>
                )}

                {activeExplainTab === "ledger" && (
                  <div className="w-full flex flex-col items-center gap-4">
                    {/* Ledger/Rewards representation */}
                    <div className="h-40 w-full overflow-hidden flex flex-col justify-end gap-2.5 font-mono text-[10px] text-zinc-400 select-none">
                      <div className="flex justify-between items-center bg-brand-cream p-2 border border-brand-light-beige/30 rounded-lg text-brand-dark">
                        <span>TX-88091 → SOLANA SETTLED</span>
                        <span className="text-brand-green font-bold text-xs">
                          +$0.145
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-brand-cream/60 p-2 border border-brand-light-beige/30 rounded-lg text-brand-gray">
                        <span>TX-88090 → SOLANA SETTLED</span>
                        <span className="text-zinc-600 font-bold text-xs">
                          +$0.081
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-brand-cream/20 p-2 border border-brand-light-beige/10 rounded-lg text-zinc-400">
                        <span>TX-88089 → SOLANA SETTLED</span>
                        <span className="text-zinc-500 font-bold text-xs">
                          +$0.940
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-label-caps text-brand-gray tracking-wider uppercase font-semibold">
                      High frequency payouts settle in micro-cents
                    </span>
                  </div>
                )}
              </div>

              {/* Status footer for simulated console */}
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>INDEX_METRICS_STREAM: STABLE</span>
                <span className="text-brand-green-bg">SPEED: 0.14 µs</span>
              </div>
            </div>

            {/* Column 2 (Detailed specifications text) */}
            <div className="lg:col-span-7 text-left space-y-6">
              <AnimatePresence mode="wait">
                {activeExplainTab === "routing" && (
                  <motion.div
                    key="routing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="font-headline-lg text-brand-dark">
                      Adaptive Global Multiplexing
                    </h3>
                    <p className="font-body-md text-brand-gray leading-relaxed">
                      Physical machines allocate spare compute units which are
                      indexable globally. When a request is triggered from deep
                      AI models or local agency pipelines, our daemon locates
                      the nearest compliant enclave host and pathways data over
                      highly secured TLS tunnels.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          0.14 µs
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Tunnel pathway lookup time across global indexers.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Multi-Channel
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Fallback load balancing route if network congestion
                          rises.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeExplainTab === "tee" && (
                  <motion.div
                    key="tee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="font-headline-lg text-brand-dark">
                      Confidential Computing Enclaves
                    </h3>
                    <p className="font-body-md text-brand-gray leading-relaxed">
                      Security cannot rely on Trust. Our software runs strictly
                      inside hardware-isolated **Trusted Execution Environments
                      (TEEs)** using AMD SEV-SNP and Intel SGX. The client
                      host's root system, operating system, and administrative
                      key holders are fully locked out of the secure boundary
                      containing client code or model packets.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Hardware-Locked
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Zero ability to view memory buffers from host console.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Signed Attestations
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Automatic cryptographic certificates verified at boot.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeExplainTab === "ledger" && (
                  <motion.div
                    key="ledger"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <h3 className="font-headline-lg text-brand-dark">
                      Frictionless Micropayments Engine
                    </h3>
                    <p className="font-body-md text-brand-gray leading-relaxed">
                      Capacity routing and task delivery are settled onto our
                      high-speed, Solana-integrated transaction layer. Hosts
                      earn real-world rewards per token calculated, megabyte
                      transfered, or routing step verified. No month-end billing
                      lists, just steady microtransaction earnings.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          Sovereign Wallets
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Your node payouts deposit directly to your encrypted
                          key treasury.
                        </p>
                      </div>
                      <div className="p-4 bg-white border border-brand-light-beige/40 rounded-xl">
                        <span className="font-mono text-xs text-brand-green font-bold block mb-1">
                          $0.0001 Unit
                        </span>
                        <p className="font-body-sm text-brand-dark text-[13px] leading-tight">
                          Pay for routing exactly to the decimal of what you
                          deliver.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Node Matrix Layout */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Text Col */}
          <div className="lg:col-span-4 space-y-6">
            <span className="font-label-caps text-brand-green font-semibold tracking-wider text-[11px] block text-left">
              HARDWARE DIRECTORY REGISTER
            </span>
            <h2 className="font-display-md text-brand-dark tracking-tight">
              Select & Inspect Qualified Node Specs
            </h2>
            <p className="font-body-md text-brand-gray leading-relaxed">
              We certify standard acron classes to maximize packet stability.
              View standardized node metrics or run our interactive latency test
              below to calculate connection efficiency.
            </p>

            {/* Interactive IP Client Tester Panel */}
            <div className="mt-8 p-6 bg-brand-cream border border-brand-light-beige rounded-2xl flex flex-col gap-4 text-left">
              <div>
                <span className="font-label-caps text-zinc-400 text-[10px] block mb-1.5 font-bold tracking-wider">
                  LOCAL ENVIRONMENT VERIFICATION
                </span>
                <p className="text-[12px] text-brand-dark leading-snug">
                  Input custom testing IP addresses to measure estimated
                  peer-to-peer route ping times.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={testNodeIp}
                  onChange={(e) => setTestNodeIp(e.target.value)}
                  className="font-mono text-xs p-2.5 bg-white border border-brand-light-beige rounded-lg focus:outline-none focus:border-brand-green flex-grow"
                  placeholder="e.g. 192.168.1.1"
                />
                <button
                  onClick={runLatencyTest}
                  disabled={isMeasuring}
                  className="px-4 py-2 bg-brand-green text-white font-label-caps text-[11px] rounded-lg tracking-wider font-semibold hover:bg-brand-green-light active:scale-95 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isMeasuring ? "PINGING..." : "TEST ROUTE"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {measuredLatency && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-brand-green-bg/25 border border-brand-green-bg/40 text-brand-green text-[12px] font-mono rounded-lg flex items-center gap-2"
                  >
                    <Check size={14} className="shrink-0 animate-bounce" />
                    <span>
                      ROUTE VERIFIED IN: <strong>{measuredLatency}</strong>
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Matrix selection & Speclist view */}
          <div className="lg:col-span-8 bg-white border border-brand-light-beige rounded-[32px] p-8 shadow-sm flex flex-col text-left">
            <div className="flex flex-wrap gap-2.5 border-b border-brand-light-beige/45 pb-6 mb-8 select-none">
              {[
                { id: "h100", label: "NVIDIA H100" },
                { id: "a100", label: "NVIDIA A100" },
                { id: "l40s", label: "L40S CLUSTER" },
                { id: "cpu", label: "INTEL XEON / AMD EPYC" },
              ].map((gpu) => (
                <button
                  key={gpu.id}
                  onClick={() => setSelectedGpu(gpu.id)}
                  className={`px-4.5 py-2 rounded-xl transition-all font-body-sm font-semibold border ${
                    selectedGpu === gpu.id
                      ? "bg-brand-green text-white border-brand-green shadow-sm scale-102"
                      : "bg-brand-cream border-brand-light-beige hover:border-brand-gray text-brand-dark"
                  }`}
                >
                  {gpu.label}
                </button>
              ))}
            </div>

            {/* Speclist block details */}
            <div className="space-y-6">
              <div>
                <p className="font-label-caps text-brand-green tracking-wider text-[11px] mb-1 font-bold">
                  NODE CLASSIFICATION SPEC
                </p>
                <h3 className="font-display font-medium text-[26px] text-brand-dark">
                  {gpuSpecs[selectedGpu as keyof typeof gpuSpecs].name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-t border-brand-cream pt-6">
                <div>
                  <span className="text-xs text-brand-gray font-sans block mb-0.5 uppercase tracking-wider">
                    Workload Capacity / Memory
                  </span>
                  <p className="font-body-md font-semibold text-brand-dark text-sm">
                    {gpuSpecs[selectedGpu as keyof typeof gpuSpecs].vram}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-brand-gray font-sans block mb-0.5 uppercase tracking-wider">
                    Estimated Base Yield
                  </span>
                  <p className="font-body-md font-bold text-brand-green text-sm">
                    {gpuSpecs[selectedGpu as keyof typeof gpuSpecs].payoutRate}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-brand-gray font-sans block mb-0.5 uppercase tracking-wider">
                    Global Traffic routing density
                  </span>
                  <p className="font-body-md font-semibold text-zinc-700 text-sm">
                    {gpuSpecs[selectedGpu as keyof typeof gpuSpecs].routingLoad}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-brand-gray font-sans block mb-0.5 uppercase tracking-wider">
                    Enclave Isolation Key Type
                  </span>
                  <code className="text-[11px] block bg-brand-cream p-1.5 mt-1 rounded font-mono text-zinc-600 border border-brand-light-beige/30">
                    {gpuSpecs[selectedGpu as keyof typeof gpuSpecs].attestation}
                  </code>
                </div>
              </div>

              <div className="p-4 bg-brand-cream border border-brand-light-beige/35 rounded-xl text-left mt-8 flex gap-3 text-xs leading-normal text-brand-gray">
                <Info size={16} className="text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>
                    Recommended task allocations for this host node
                    configuration:
                  </strong>{" "}
                  {gpuSpecs[selectedGpu as keyof typeof gpuSpecs].optimalTask}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Layout */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-brand-light-beige/30">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="font-display-md text-brand-dark mb-4 tracking-tight leading-none">
            Complete Physical Sovereignty
          </h2>
          <p className="font-body-lg text-brand-gray">
            Every module engineered for resilience, isolation, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-cream/60 border border-brand-light-beige/30 p-8 rounded-2xl text-left space-y-4">
            <div className="p-3 bg-white w-fit rounded-xl border border-brand-light-beige/20 text-brand-green">
              <Zap size={22} />
            </div>
            <h4 className="font-display font-medium text-xl text-brand-dark">
              Dynamic Balancing
            </h4>
            <p className="font-body-sm text-brand-gray text-[13px] leading-relaxed">
              If node latency spikes above 20ms or uptime lags, our protocol
              triggers safe hot-swaps, piping user code streams seamlessly to
              standard backup nodes.
            </p>
          </div>

          <div className="bg-brand-cream/60 border border-brand-light-beige/30 p-8 rounded-2xl text-left space-y-4">
            <div className="p-3 bg-white w-fit rounded-xl border border-brand-light-beige/20 text-brand-green">
              <ShieldCheck size={22} />
            </div>
            <h4 className="font-display font-medium text-xl text-brand-dark">
              Intel SGX / AMD SEV TEE
            </h4>
            <p className="font-body-sm text-brand-gray text-[13px] leading-relaxed">
              Runs strictly inside encrypted memory chips. Administrative logins
              can never peek at user tensors, API data pipelines, or code
              environments.
            </p>
          </div>

          <div className="bg-brand-cream/60 border border-brand-light-beige/30 p-8 rounded-2xl text-left space-y-4">
            <div className="p-3 bg-white w-fit rounded-xl border border-brand-light-beige/20 text-brand-green">
              <Layers size={22} />
            </div>
            <h4 className="font-display font-medium text-xl text-brand-dark">
              Solana settlement
            </h4>
            <p className="font-body-sm text-brand-gray text-[13px] leading-relaxed">
              Ditches high invoices and billing desks. Every micro-routing task
              allocates real-time cash payouts directly into standard, secure
              wallets.
            </p>
          </div>
        </div>
      </section>

      {/* Final Action Module Banner */}
      <section className="py-20 bg-brand-green text-white w-full rounded-3xl max-w-7xl mx-auto px-6 mb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-2xl text-left relative z-10 space-y-6">
          <h2 className="font-display-md leading-none text-white tracking-tight">
            Ready to integrate your hardware?
          </h2>
          <p className="text-white/80 font-body-md text-[15px] leading-relaxed">
            Deploy the lightweight daemon container. Handshake takes under 3
            minutes. Your cluster begins earning instantly per capacity token
            computed.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onStartEarning}
              className="px-6 py-4.5 bg-brand-dark text-white font-label-caps text-[11px] font-semibold border-none rounded-lg tracking-wider hover:bg-black hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              CONNECT CAPACITY NODE
            </button>
            <button
              onClick={onNavigateToDocs}
              className="px-6 py-4.5 border border-white hover:bg-white/10 font-label-caps text-[11px] rounded-lg tracking-wider transition-all duration-300"
            >
              READ PROTOCOL MANUAL
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
