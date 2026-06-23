"use client";

import React, { useState } from "react";
import { 
  ArrowCircleUp, 
  Eye, 
  Wrench, 
  Plus, 
  Stack, 
  X, 
  Globe, 
  ArrowsCounterClockwise, 
  CircleNotch,
  CheckCircle,
  Database
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface Environment {
  id: string;
  name: string;
  type: "production" | "preview" | "development" | "pre-production";
  domain: string;
  description?: string;
  branchTracking: boolean;
  attachDomain: boolean;
  importVariables: boolean;
  status: "active" | "creating" | "idle";
}

export default function EnvironmentsPanel() {
  const [environments, setEnvironments] = useState<Environment[]>([
    {
      id: "prod",
      name: "Production",
      type: "production",
      domain: "intelscout-snowy.vercel.app",
      branchTracking: true,
      attachDomain: true,
      importVariables: false,
      status: "active"
    },
    {
      id: "prev",
      name: "Preview",
      type: "preview",
      domain: "No custom domains",
      branchTracking: true,
      attachDomain: false,
      importVariables: false,
      status: "active"
    },
    {
      id: "dev",
      name: "Development",
      type: "development",
      domain: "No custom domains",
      branchTracking: false,
      attachDomain: false,
      importVariables: false,
      status: "active"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [envName, setEnvName] = useState("");
  const [description, setDescription] = useState("");
  const [branchTracking, setBranchTracking] = useState(false);
  const [attachDomain, setAttachDomain] = useState(false);
  const [importVariables, setImportVariables] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEnvironment = (e: React.FormEvent) => {
    e.preventDefault();
    const name = envName.trim() || "staging";
    setIsSubmitting(true);

    setTimeout(() => {
      const newEnv: Environment = {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        type: "pre-production",
        domain: attachDomain ? `intelscout-${name.toLowerCase()}.vercel.app` : "No custom domains",
        description: description.trim() || "A place for all staging deployments",
        branchTracking,
        attachDomain,
        importVariables,
        status: "active"
      };

      setEnvironments(prev => [...prev, newEnv]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      
      // Reset form
      setEnvName("");
      setDescription("");
      setBranchTracking(false);
      setAttachDomain(false);
      setImportVariables(false);
    }, 1200);
  };

  const getEnvIcon = (type: Environment["type"]) => {
    switch (type) {
      case "production":
        return <ArrowCircleUp className="w-4 h-4 text-emerald-600" />;
      case "preview":
        return <Eye className="w-4 h-4 text-[#888]" />;
      case "development":
        return <Wrench className="w-4 h-4 text-[#888]" />;
      default:
        return <Stack className="w-4 h-4 text-violet-600" />;
    }
  };

  return (
    <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
        <div>
          <h3 className="text-sm font-bold text-[#111] uppercase tracking-wider font-outfit">Environments</h3>
          <p className="text-[10px] text-[#666]">
            Environments help manage the lifecycle of your deployments, enabling preview, testing, and production workflows.
          </p>
        </div>
        
        {/* Create Environment Trigger Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-550 text-white rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-lg shadow-violet-600/10"
        >
          <Plus className="w-3.5 h-3.5 font-bold" />
          <span>New Environment</span>
        </button>
      </div>

      {/* Environments Table */}
      <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
        <div className="border border-black/10 rounded-xl overflow-hidden bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-black/10 text-[9px] font-bold text-[#666] uppercase tracking-widest">
                <th className="p-4">Name</th>
                <th className="p-4">Domains</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {environments.map((env) => (
                <tr key={env.id} className="hover:bg-[#fafafa] text-xs transition duration-150">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="p-1.5 bg-[#fafafa] border border-black/10 rounded-lg shrink-0">
                      {getEnvIcon(env.type)}
                    </div>
                    <div>
                      <span className="font-bold text-[#111] leading-none block">{env.name}</span>
                      {env.description && (
                        <span className="text-[10px] text-[#666] block mt-0.5">{env.description}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[#555]">
                    {env.domain !== "No custom domains" ? (
                      <a 
                        href={`https://${env.domain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-violet-600 hover:underline flex items-center space-x-1"
                      >
                        <Globe className="w-3.5 h-3.5 inline mr-1 shrink-0" />
                        <span>{env.domain}</span>
                      </a>
                    ) : (
                      <span className="text-[#aaa]">{env.domain}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-md text-[9px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-1" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Create Pre-production Environment */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-black/10 rounded-2xl w-full max-w-md p-6 relative overflow-hidden shadow-2xl z-10"
            >
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-black/5 rounded-lg text-[#888] hover:text-[#111] transition disabled:opacity-30"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <h3 className="text-base font-bold text-[#111] font-outfit">Create Pre-production Environment</h3>
                <p className="text-xs text-[#666] mt-1">
                  Pre-production environments dedicated to development and reviewing deployed changes without affecting production.
                </p>
              </div>

              <form onSubmit={handleCreateEnvironment} className="space-y-5">
                {/* Environment Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider block">Environment Name</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-[#555]">
                      <Database className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      required
                      disabled={isSubmitting}
                      value={envName}
                      onChange={(e) => setEnvName(e.target.value)}
                      placeholder="staging"
                      className="w-full bg-[#fafafa] border border-black/10 focus:border-violet-300 pl-10 pr-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition text-[#111]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#888] uppercase tracking-wider block">Description (optional)</label>
                  <input 
                    type="text" 
                    disabled={isSubmitting}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A place for all staging deployments"
                    className="w-full bg-[#fafafa] border border-black/10 focus:border-violet-300 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none transition text-[#111]"
                  />
                </div>

                {/* Switches */}
                <div className="space-y-3 pt-2">
                  {/* Branch Tracking Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#111] block">Branch Tracking</span>
                      <span className="text-[10px] text-[#666] block">When enabled, each qualifying merge will generate a deployment</span>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setBranchTracking(!branchTracking)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        branchTracking ? "bg-violet-600" : "bg-[#e0e0e0]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          branchTracking ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Attach Domain Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#111] block">Attach Domain</span>
                      <span className="text-[10px] text-[#666] block">Automatically assign a domain to the newest deployment</span>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setAttachDomain(!attachDomain)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        attachDomain ? "bg-violet-600" : "bg-[#e0e0e0]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          attachDomain ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Import Variables Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#111] block">Import Variables From Another Environment</span>
                      <span className="text-[10px] text-[#666] block">Attach current environment variables from another environment</span>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setImportVariables(!importVariables)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        importVariables ? "bg-violet-600" : "bg-[#e0e0e0]"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          importVariables ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-black/10">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-[#fafafa] hover:bg-black/5 border border-black/10 text-[10px] font-bold text-[#888] hover:text-[#111] rounded-xl uppercase tracking-wider transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-550 text-[10px] font-bold text-white rounded-xl uppercase tracking-wider transition shadow-lg shadow-violet-600/10 cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotch className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
