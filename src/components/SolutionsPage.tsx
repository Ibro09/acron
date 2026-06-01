import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Workflow, 
  Cpu, 
  Globe, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight, 
  Check, 
  HelpCircle,
  Activity,
  ArrowUpRight,
  Sparkles,
  Award
} from "lucide-react";

export default function SolutionsPage({ onStartEarning }: { onStartEarning: () => void }) {
  // Solutions tabs
  const [selectedIndustry, setSelectedIndustry] = useState<"ai_agents" | "depin" | "api_relays" | "enterprise">("ai_agents");
  
  // Dynamic case study metrics slider
  const [channelsQuantity, setChannelsQuantity] = useState<number>(18);

  const calculateFidelityStats = () => {
    return {
      throughput: (channelsQuantity * 12.4).toFixed(1) + " MB/s",
      reliability: (99.94 + (channelsQuantity * 0.001)).toFixed(3) + "%",
      solanaTrans: Math.floor(channelsQuantity * 144) + " tx / sec",
      estimatedSavings: "$" + (channelsQuantity * 120).toLocaleString() + " / yr"
    };
  };

  const calculatedStats = calculateFidelityStats();

  const industries = {
    ai_agents: {
      title: "AI Agent Orchestrators",
      subtitle: "Autonomous networks looking for high-availability agent hosting hosts.",
      description: "Agents execute self-improving loops. They need low-latency nodes that can run continuously in high security zones without risking credentials or state parameters. The Acron Protocol secures state buffers in Intel SGX, ensuring agents execute tasks flawlessly.",
      metrics: { latency: "0.24 ms", accuracy: "99.98% SGX Attested", savings: "54% Node Cost Reduction" },
      nodesNeeded: "NVIDIA H100 | AI Agent Host Runner",
      icon: Sparkles
    },
    depin: {
      title: "Decentralized Physical Networks (DePIN)",
      subtitle: "Scaling computing grids without setting up custom server farms.",
      description: "DePIN operators pool resource bandwidth across decentralized territories. We act as and bridge a neutral liquidity layer, indexing available chips and routing jobs securely. This drops startup hardware overhead entirely.",
      metrics: { latency: "0.45 ms", accuracy: "AMD SEV Isolation Pass", savings: "70% Zero Capital Cost" },
      nodesNeeded: "NVIDIA A100 | Storage Block Nodes",
      icon: Cpu
    },
    api_relays: {
      title: "Global API Providers",
      subtitle: "Edge gateways looking to localized Webhook caching, and low-latency proxy routing.",
      description: "Heavy database roundtrips burn through server cycles. We proxy requests over localized edge nodes, caching webhook payloads, verifying request parameters in secure enclaves, and settling payments per transfer with nano-Solana payouts.",
      metrics: { latency: "0.19 ms", accuracy: "TLS Secured Node tunnels", savings: "42% Over-the-air Congestion Slashed" },
      nodesNeeded: "REST Router Host | Standard Xeon Gold Host",
      icon: Globe
    },
    enterprise: {
      title: "Institutional Data Systems",
      subtitle: "Enterprise-grade analytical structures looking for compliance with high security guidelines.",
      description: "Secure data pipelines necessitate isolated platforms. Our systems leverage hardware enclave boundaries to route and process institutional analytics, achieving complete SOC-2 compliance alongside physical identity privacy.",
      metrics: { latency: "0.85 ms", accuracy: "Intel Trust Domain certified", savings: "85% Compliance overhead drop" },
      nodesNeeded: "NVIDIA A100 | CPU Cache Proxy System",
      icon: Database
    }
  };

  return (
    <div className="w-full flex flex-col text-left">
      
      {/* Solutions Header */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            TARGET SECTOR FIT
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            Institutional reliability. <span className="text-brand-green-light block italic font-medium mt-1">Sized for modern scales.</span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-10 leading-relaxed">
            From high-frequency AI agents to compliant enterprise storage structures. Learn how the protocol delivers dedicated physical performance across your sector's most critical bottlenecks.
          </p>
        </div>
      </section>

      {/* Interactive Solutions Tab Grid */}
      <section className="py-16 bg-brand-cream/60 border-y border-brand-light-beige/30 w-full px-6">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Nav menu Column (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col gap-3 text-left">
              <span className="font-label-caps text-[10px] text-brand-gray block tracking-wider font-semibold mb-2">INDUSTRY ARCHITECTURES</span>
              {[
                { id: "ai_agents", label: "AI Agent Orchestrators", desc: "Autonomous agent execution state hosts", icon: Sparkles },
                { id: "depin", label: "DePIN Grids", desc: "Decentralized physical hardware pooling", icon: Cpu },
                { id: "api_relays", label: "Global API Relays", desc: "Low-latency API proxies and edge cache", icon: Globe },
                { id: "enterprise", label: "Enterprise Data Systems", desc: "Compliant SOC-2 computing pipelines", icon: Database }
              ].map((ind) => {
                const Icon = ind.icon;
                return (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndustry(ind.id as any)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                      selectedIndustry === ind.id
                      ? "bg-white border-brand-green shadow-md text-brand-green scale-[1.01]"
                      : "border-brand-light-beige hover:border-brand-gray bg-white/40 text-brand-dark"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${selectedIndustry === ind.id ? "bg-brand-green text-white" : "bg-brand-cream text-brand-gray"}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-body-sm font-semibold tracking-tight text-[14px] leading-snug">{ind.label}</h4>
                      <p className="text-[11px] text-brand-gray leading-tight mt-0.5">{ind.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Display detail Column (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-brand-light-beige rounded-[32px] p-8 shadow-sm text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndustry}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div>
                    <span className="font-label-caps text-brand-green tracking-wider text-[11px] mb-1 font-bold">CASE ARCHITECTURE MATRIX</span>
                    <h3 className="font-display font-medium text-[28px] text-brand-dark leading-tight">
                      {industries[selectedIndustry].title}
                    </h3>
                    <p className="font-sans italic text-sm text-brand-gray mt-1 font-medium select-none">
                      {industries[selectedIndustry].subtitle}
                    </p>
                  </div>

                  <p className="font-body-md text-brand-gray leading-relaxed">
                    {industries[selectedIndustry].description}
                  </p>

                  {/* Nodes Needed Badge list */}
                  <div className="p-3.5 bg-brand-cream rounded-xl flex items-center gap-2 border border-brand-light-beige/35">
                    <Award size={15} className="text-brand-green shrink-0" />
                    <span className="text-xs text-brand-gray font-sans">Required Platform Node allocation size: <strong>{industries[selectedIndustry].nodesNeeded}</strong></span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-cream pt-6 mt-6">
                    <div className="p-4 bg-brand-cream/40 border border-brand-light-beige/20 rounded-xl text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray block mb-1">PROXIED LATENCY</span>
                      <p className="font-mono text-brand-green font-bold text-sm tracking-tight">{industries[selectedIndustry].metrics.latency}</p>
                    </div>
                    <div className="p-4 bg-brand-cream/40 border border-brand-light-beige/20 rounded-xl text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray block mb-1">SECURE BOUNDARY</span>
                      <p className="font-body-sm font-semibold text-brand-green text-sm">{industries[selectedIndustry].metrics.accuracy}</p>
                    </div>
                    <div className="p-4 bg-brand-cream/40 border border-brand-light-beige/20 rounded-xl text-left">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray block mb-1">SLA YIELD IMPROVEMENT</span>
                      <p className="font-mono text-zinc-800 font-bold text-sm tracking-tight">{industries[selectedIndustry].metrics.savings}</p>
                    </div>
                  </div>

                  {/* Route design visual vector overlay */}
                  <div className="bg-zinc-950 p-4 rounded-xl font-mono text-[11px] text-zinc-400 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[10px] font-sans font-bold text-brand-green-bg border-b border-white/5 pb-1 select-none">
                      <span>SECURE PIPELINE SIMULATOR OUT</span>
                      <span>STATUS: ROUTING OK</span>
                    </div>
                    <p className="text-emerald-400">$ protocol-solutions --industry={selectedIndustry} --check-peer</p>
                    <p className="text-zinc-500">▶ Handshaking with verified {industries[selectedIndustry].nodesNeeded.split(" | ")[0]} enclaves...</p>
                    <p className="text-zinc-300">✔ TEE Attestation confirmed. Latency established: {industries[selectedIndustry].metrics.latency}</p>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Case Studies Simulation & Live Performance Estimator */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display-md text-brand-dark mb-4 tracking-tight lead-none">Simulate Solution Efficiency</h2>
          <p className="font-body-lg text-brand-gray">Adjust route channels and calculate immediate network performance advantages with deep resource pipelines.</p>
        </div>

        <div className="bg-white border border-brand-light-beige/30 rounded-[32px] p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Range Controller */}
            <div className="space-y-8 text-left">
              <div>
                <p className="font-label-caps text-brand-gray tracking-wider text-[11px] mb-1 font-bold">ROUTING QUANTITY CONFIG</p>
                <h4 className="font-headline-md text-brand-dark">Allocate Virtual Traffic Channels</h4>
              </div>

              <div className="space-y-4">
                <input
                  type="range"
                  min="2"
                  max="120"
                  value={channelsQuantity}
                  onChange={(e) => setChannelsQuantity(parseInt(e.target.value))}
                  className="w-full h-2 bg-brand-cream accent-brand-green rounded-lg cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between text-xs text-brand-gray font-medium font-sans">
                  <span>2 Channels</span>
                  <span className="bg-brand-cream text-brand-green px-2.5 py-1 rounded border border-brand-light-beige/35 font-mono text-[11.5px] font-semibold">
                    {channelsQuantity} Dedicated Secure Paths
                  </span>
                  <span>120 Channels</span>
                </div>
              </div>

              <div className="p-4 bg-brand-cream/80 border border-brand-light-beige/25 rounded-xl flex gap-3 text-xs leading-normal text-brand-gray">
                <Activity size={16} className="text-brand-green shrink-0 mt-0.5" />
                <p>
                  <strong>Scale Recommendation:</strong> At this bandwidth intensity, we leverage multiple secure TEE clusters globally. Multi-channel pathways minimize pipeline packet congestion and maximize reliability index.
                </p>
              </div>
            </div>

            {/* Right Result visual list */}
            <div className="grid grid-cols-2 gap-6 text-left">
              
              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">THROUGHPUT RATIO</span>
                <span className="text-xl font-mono text-zinc-900 font-bold block mt-1">{calculatedStats.throughput}</span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">Optimized peer pipeline</span>
              </div>

              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">SLA GUARANTEED</span>
                <span className="text-xl font-mono text-emerald-600 font-bold block mt-1">{calculatedStats.reliability}</span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">Uptime target SLA</span>
              </div>

              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">SOLANA PROTOCOL TPS</span>
                <span className="text-xl font-mono text-zinc-900 font-bold block mt-1">{calculatedStats.solanaTrans}</span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">Micro-payout speed settling</span>
              </div>

              <div className="bg-brand-cream/40 p-5 rounded-2xl border border-brand-light-beige/20 flex flex-col gap-1 hover:border-brand-green-bg/50 transition-colors">
                <span className="text-[10px] text-brand-gray uppercase font-bold tracking-wider">ESTIMATED BILL CUT</span>
                <span className="text-xl font-mono text-brand-green font-bold block mt-1">{calculatedStats.estimatedSavings}</span>
                <span className="text-[11px] text-brand-gray italic font-medium leading-tight">Annual hardware savings</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Compliance Certification Module Block */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-brand-light-beige/30 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <span className="font-label-caps text-brand-green text-[11px] block text-left tracking-wider font-bold">MILITARY CONFIDENTIALITY SPEC</span>
            <h2 className="font-display-md text-brand-dark tracking-tight leading-none text-4xl lg:text-5xl">Strict sovereign compliance boundaries.</h2>
            <p className="font-body-md text-brand-gray leading-relaxed max-w-2xl text-[15px]">
              Every single node router undergoes an automated, secure remote attestation cycle upon bootstrap. If the node fails chip verification, key audits, or platform TEE checks, the hardware has its keys revoked instantly on-chain—fully isolated.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2 items-start text-xs leading-relaxed text-zinc-700">
                <Check size={16} className="text-brand-green shrink-0 mt-0.5" />
                <span><strong>SOC-2 standard compliant logic barriers:</strong> Complete administrative lockout across memory blocks.</span>
              </div>
              <div className="flex gap-2 items-start text-xs leading-relaxed text-zinc-700">
                <Check size={16} className="text-brand-green shrink-0 mt-0.5" />
                <span><strong>Hardware identity registration on Solana:</strong> Private, certified key pairings for anonymous, secure operations.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            {/* Standard Shield Badge mockup */}
            <div className="p-8 bg-brand-cream border border-brand-light-beige rounded-[24px] text-center w-64 shadow-md flex flex-col items-center gap-4 hover:scale-102 transition-transform">
              <div className="p-4 bg-brand-green-bg/25 text-brand-green rounded-full">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h4 className="font-display font-medium text-lg text-brand-dark">TEE Isolated Stack</h4>
                <p className="text-[11px] text-brand-gray mt-1 leading-snug font-sans">Remote Hardware Attestation Certificate Certified (SEC-2)</p>
              </div>
              <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-700 font-semibold px-2 py-1 rounded">AUDIT STATUS: EXCELLENT</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
