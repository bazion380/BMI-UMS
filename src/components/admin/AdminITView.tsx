import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Server, Key, FileText, CheckCircle2 } from 'lucide-react';

export const AdminITView: React.FC = () => {
  const { auditLogs, resetDemoData } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Server className="w-6 h-6 text-indigo-400" />
          <span>IT Infrastructure & RBAC System Administration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Identity Provider (OIDC/SSO), Role-Based Access Control matrix, and immutable security audit logs.
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">OIDC Identity Provider</span>
          <div className="text-2xl font-bold text-emerald-400 mt-2">SSO Active</div>
          <p className="text-emerald-400 text-[11px] mt-1">MFA Enforced across 11 Roles</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">API Gateway Health</span>
          <div className="text-2xl font-bold text-white mt-2">100% Operational</div>
          <p className="text-slate-400 text-[11px] mt-1">Latency: 12ms</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-slate-400 font-semibold">Database Persistence</span>
          <div className="text-2xl font-bold text-indigo-400 mt-2">Encrypted at Rest</div>
          <p className="text-slate-400 text-[11px] mt-1">Local & Cloud Synced</p>
        </div>
      </div>

      {/* Audit Log Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-white text-base flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Live Security Audit Logs ({auditLogs.length} Events)</span>
          </h2>
          <button
            onClick={() => {
              if (confirm('Re-initialize entire UMS seed database?')) {
                resetDemoData();
              }
            }}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition"
          >
            Reset System Seed Data
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {auditLogs.map(log => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span className="text-indigo-300 font-bold">[{log.timestamp}] {log.action}</span>
                <span className="text-emerald-400">{log.performedBy}</span>
              </div>
              <p className="text-slate-300">{log.details}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
