import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Terminal as TerminalIcon,
  Database,
  BookOpen,
  Search,
  Activity,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Cpu,
  Info,
} from "lucide-react";

export default function ResourcesPage({
  onNavigateToDocs,
  onStartEarning,
}: { onNavigateToDocs?: () => void; onStartEarning?: () => void } = {}) {
  // Whitepaper active section
  const [activeResTab, setActiveResTab] = useState<
    "abstract" | "tokenomics" | "cryptography"
  >("abstract");

  // Terminal commands copy state
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Live Blockchain stats simulation
  const [onChainNodes, setOnChainNodes] = useState<number>(14208);
  const [microSolTps, setMicroSolTps] = useState<number>(452);
  const [totalSolBurnt, setTotalSolBurnt] = useState<number>(121.84);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnChainNodes((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
      setMicroSolTps((prev) => Math.floor(400 + Math.random() * 120));
      setTotalSolBurnt((prev) =>
        parseFloat((prev + Math.random() * 0.05).toFixed(2)),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  };

  const whitepaperSections = {
    abstract: {
      title: "Abstract Overview: Multi-Route Multiplexing",
      content:
        "Current decentralized compute architectures suffer from severe transaction congestion and latency bottlenecks. Traditional physical machines allocate acron resources, but lacks trust verification boundaries. We introduce Acron Protocol: a standard routing architecture leveraging hardware-isolated Trusted Execution Environments (TEEs) tightly coupled with high-frequency Solana settlement ledger units. By abstracting raw machines into secured, anonymous pipelines, clients execute sensitive data processing over untrusted regional peers with zero compliance compromise.",
      bullets: [
        "Elimination of month-end manual invoicing through automatic smart settlement ledger loops.",
        "Zero access boundary verification model utilizing peer Intel SGX hardware keys.",
        "Adaptive pathway fail-safes dynamic switching.",
      ],
    },
    tokenomics: {
      title: "System Micro-Incentives & Solana Ledger",
      content:
        "The protocol achieves zero economic overhead via sub-ms settlement channels built directly over Solana ledger architecture. Hosts earn real-time micro rewards per token calculated, megabyte cached, or endpoint packet routed. Rewards calculate instantly based on regional network density, target hardware speed class, and certified uptime logs.",
      bullets: [
        "Demand side users pay flat micro units ($0.0001 SLA) directly per routing pipeline usage.",
        "Active node hosts collect payouts directly into their secure non-custodial treasury keys.",
        "Deflationary burns: small protocol fees are auto-converted to buy-back-and-burn on-chain assets.",
      ],
    },
    cryptography: {
      title: "Remote Hardware Attestation & Enclave Keys",
      content:
        "Physical nodes register on the indexer by delivering signed attestation certificates generated directly by secure chip microprocessors (Intel SGX / AMD SEV-SNP). A public registry validates these keys against certified manufacturer root paths on-chain, proving the target pipeline operates within isolated memory buffers that securely fence off executive host logins.",
      bullets: [
        "Cryptographic proof of isolation (POI) checked during every single connection hook.",
        "Dynamic key generation keeps private TLS tunnel pathways fully anonymous.",
        "Hardware revocation: non-compliant or altered hosts have their indexer routing keys revoked automatically.",
      ],
    },
  };

  const setupCommands = [
    {
      title: "Ubuntu / Debian Single Node install",
      cmd: "curl -sS https://protocol.dev/install.sh | bash",
    },
    {
      title: "Docker Host Container boot",
      cmd: 'docker run -d --name protocol-node -e PRIVATE_KEY="YOUR_KEY" acron/daemon:latest',
    },
    {
      title: "Register secure Node with regional indexer",
      cmd: 'protocol-admin register --node-name="London-Core-H100"',
    },
  ];

  return (
    <div className="w-full flex flex-col text-left">
      {/* Resources Header */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto w-full">
        <div className="max-w-3xl">
          <span className="font-label-caps text-brand-green mb-4 tracking-widest block bg-brand-green-bg/20 self-start px-2.5 py-1 rounded-full text-[10px] w-fit">
            TECHNICAL REFERENCE & GUIDES
          </span>
          <h1 className="font-display-lg text-brand-dark tracking-tighter leading-[1.08] mb-6">
            Developer documentations{" "}
            <span className="text-brand-green-light block italic font-medium mt-1">
              and live blockchain stats.
            </span>
          </h1>
          <p className="font-body-lg text-brand-gray max-w-2xl mb-10 leading-relaxed">
            Read through Whitepapers outlining secure Attestation Mechanics, set
            up Ubuntu or Docker node daemons in under 3 minutes, and observe
            real-time global protocol blockchain metrics.
          </p>
        </div>
      </section>

      {/* Live Blockchain Telemetry Stat cards */}
      <section className="py-12 px-6 bg-brand-dark text-white w-full border-y border-zinc-800">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-8 border-b border-zinc-800 pb-4 select-none">
            <Activity className="text-brand-green-bg animate-pulse" size={16} />
            <span className="font-label-caps text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
              LIVE BLOCKCHAIN LEDGER TELEMETRY STREAM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-zinc-900/60 rounded-xl space-y-2 border border-zinc-800">
              <span className="font-label-caps text-zinc-500 text-[9px] tracking-wider block font-bold">
                TOTAL REGISTERED HARDWARE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono text-white font-bold tracking-tight">
                  {onChainNodes.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-500 font-bold font-sans">
                  Active Nodes
                </span>
              </div>
              <p className="font-sans text-[11px] text-zinc-500">
                Live hosts running verified secure enclaves globally.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/60 rounded-xl space-y-2 border border-zinc-800">
              <span className="font-label-caps text-zinc-500 text-[9px] tracking-wider block font-bold">
                SOLANA SETTLEMENT SPEED
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono text-white font-bold tracking-tight">
                  {microSolTps} tps
                </span>
                <span className="text-[11px] text-brand-green-bg font-bold font-sans">
                  TPS Index
                </span>
              </div>
              <p className="font-sans text-[11px] text-zinc-500">
                Micro-transactions settling active capacity rewards.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/60 rounded-xl space-y-2 border border-zinc-800">
              <span className="font-label-caps text-zinc-500 text-[9px] tracking-wider block font-bold">
                TOTAL DEFLATIONARY ACCRUED BURNS
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono text-white font-bold tracking-tight">
                  {totalSolBurnt.toFixed(2)} SOL
                </span>
                <span className="text-[11px] text-zinc-400 font-sans">
                  Burned Sol
                </span>
              </div>
              <p className="font-sans text-[11px] text-zinc-500">
                Protocol fees automatically converted & locked on-chain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Whitepaper Mini Reader Tab component */}
      <section className="py-24 px-6 bg-brand-cream/60 border-b border-brand-light-beige/30 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-xl text-left mb-12 space-y-3">
            <span className="font-label-caps text-brand-green font-bold tracking-wider text-[11px]">
              ACADEMIC RESEARCH REFERENCE
            </span>
            <h2 className="font-display-md text-brand-dark tracking-tight leading-none text-3xl md:text-4xl">
              System Whitepaper Preview
            </h2>
            <p className="font-body-sm text-brand-gray leading-relaxed text-[13.5px]">
              Explore excerpts from the "Protocol v4: Hardware isolated
              multipath computing networks" whitepaper publication. Use tabs
              below to browse layout sections.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Excerpt selection menu */}
            <div className="lg:col-span-4 flex flex-col gap-2.5 text-left select-none">
              {[
                {
                  id: "abstract",
                  title: "Abstract Overview",
                  desc: "Why we built secure multi-route networks",
                },
                {
                  id: "tokenomics",
                  title: "Settlement Incentives",
                  desc: "How micro-incentives execute on Solana",
                },
                {
                  id: "cryptography",
                  title: "Hardware Attestation",
                  desc: "Verifying secure memory enclaves (TEE)",
                },
              ].map((sect) => (
                <button
                  key={sect.id}
                  onClick={() => setActiveResTab(sect.id as any)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    activeResTab === sect.id
                      ? "bg-white border-brand-green shadow-md text-brand-green scale-102"
                      : "border-brand-light-beige hover:border-brand-gray bg-white/40 text-brand-dark"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <BookOpen
                      size={15}
                      className={
                        activeResTab === sect.id
                          ? "text-brand-green"
                          : "text-brand-gray"
                      }
                    />
                    <h4 className="font-body-sm font-semibold text-[14px]">
                      {sect.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-brand-gray leading-tight mt-1">
                    {sect.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Content area: Styled like paper */}
            <div className="lg:col-span-8 bg-white border border-brand-light-beige rounded-[32px] p-8 md:p-10 shadow-sm text-left relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeResTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <p className="font-label-caps text-brand-green tracking-wide text-[10.5px] font-bold">
                    SYSTEM DOC EXCERPT SEC: V4-1
                  </p>
                  <h3 className="font-display font-medium text-[24px] text-brand-dark leading-tight border-b border-brand-cream pb-4">
                    {whitepaperSections[activeResTab].title}
                  </h3>

                  <p className="font-display font-normal text-[17px] text-zinc-700 leading-relaxed italic first-letter:text-4xl first-letter:font-bold first-letter:font-display first-letter:float-left first-letter:mr-2">
                    {whitepaperSections[activeResTab].content}
                  </p>

                  <div className="space-y-3 pt-4">
                    <h5 className="font-sans text-[11px] text-brand-dark font-bold tracking-wider uppercase select-none">
                      Core Technical Propositions:
                    </h5>
                    <ul className="space-y-2.5 text-xs text-brand-gray font-sans list-none">
                      {whitepaperSections[activeResTab].bullets.map(
                        (bullet, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <Check
                              size={14}
                              className="text-brand-green shrink-0 mt-0.5"
                            />
                            <span>{bullet}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-brand-cream text-right">
                    <button
                      onClick={() => onNavigateToDocs?.()}
                      className="inline-flex items-center gap-1.5 font-label-caps text-[10.5px] tracking-wider text-brand-green font-bold hover:text-brand-green-light hover:underline cursor-pointer"
                    >
                      <span>VIEW FULL ACADEMIC PDF MANUAL</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Command reference Setup guides */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-6">
            <span className="font-label-caps text-brand-green font-bold tracking-wider text-[11px] block text-left">
              REFERENCE CODES
            </span>
            <h2 className="font-display-md text-brand-dark tracking-tight leading-none text-3xl md:text-4xl">
              Node Host Setup Terminal Guides
            </h2>
            <p className="font-body-md text-brand-gray leading-relaxed text-[14px]">
              Deploy secure hosts inside remote acron environments. Copy any
              command below to set up secure local environments in under 3
              minutes.
            </p>

            <div className="p-4.5 bg-brand-cream border border-brand-light-beige/35 rounded-xl flex gap-3 text-xs leading-normal text-brand-gray select-none">
              <Info size={16} className="text-brand-green shrink-0 mt-0.5" />
              <p>
                <strong>Security note:</strong> Ensure your CPU virtualization
                settings (Intel VT-x / AMD-V) alongside Hardware secure enclaves
                (SGX / SEV) are fully active inside bios configs.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-zinc-950 text-white rounded-[24px] p-6 md:p-8 space-y-6 border border-zinc-850">
            {setupCommands.map((item, idx) => (
              <div
                key={idx}
                className="space-y-2.5 text-left pb-6 border-b border-zinc-900 last:border-0 last:pb-0"
              >
                <span className="text-[11px] font-sans font-bold text-zinc-400 block tracking-wider uppercase select-none">
                  {item.title}
                </span>

                <div className="bg-black text-emerald-400 font-mono text-xs rounded-xl p-4 flex justify-between items-center gap-4 relative group overflow-x-auto select-all">
                  <code>{item.cmd}</code>

                  <button
                    onClick={() => copyToClipboard(item.cmd, idx)}
                    className="p-1 px-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg text-[10px] hover:text-white hover:border-zinc-700 transition-all font-sans flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check
                          size={11}
                          className="text-emerald-500 animate-ping"
                        />
                        <span className="text-emerald-500 font-bold">
                          COPIED
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>COPY CMD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
