import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const DocumentsView = () => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // Logic for file handling would go here
        console.log('Files dropped:', e.dataTransfer.files);
    };

    const documents = [
        { name: 'BFA_Extrato_Jan2025.pdf', status: 'completed', date: 'Hoje, 14:30', type: 'Extrato Bancário' },
        { name: 'Unitel_Dividendo_Nota.pdf', status: 'completed', date: 'Ontem', type: 'Nota de Dividendo' },
        { name: 'Relatorio_Investimento_Q4_2024.pdf', status: 'processing', date: 'Agora', type: 'Relatório' },
        { name: 'Fatura_Condominio_Talisat.pdf', status: 'error', date: '12 Jan 2025', type: 'Fatura' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle size={18} className="text-green-500" />;
            case 'processing': return <Clock size={18} className="text-blue-500 animate-pulse" />;
            case 'error': return <AlertCircle size={18} className="text-red-500" />;
            default: return <Clock size={18} className="text-slate-400" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Ingestão de Documentos (OCR)</h1>
                <p className="text-slate-500 mt-1">
                    Automate a entrada de dados financeiros a partir de documentos PDF e imagens.
                </p>
            </header>

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer
          ${isDragging
                        ? 'border-pcfh-gold bg-pcfh-gold/5 scale-[1.02]'
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <UploadCloud size={40} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Arraste seus arquivos aqui</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Suporte para extratos bancários (BFA, BAI), relatórios de corretoras e faturas.
                    Modelos de IA ajustados para o contexto angolano.
                </p>
                <button className="mt-8 bg-pcfh-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-pcfh-800 transition shadow-md hover:shadow-lg">
                    Selecionar Arquivos do Computador
                </button>
            </div>

            {/* Recent Documents */}
            <div>
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-slate-400" />
                    Arquivos Processados Recentemente
                </h4>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-1"></div>
                        <div className="col-span-5">Nome do Arquivo</div>
                        <div className="col-span-3">Tipo</div>
                        <div className="col-span-3 text-right">Data / Status</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {documents.map((doc, idx) => (
                            <div key={idx} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition">
                                <div className="col-span-1 flex justify-center">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <FileText size={20} />
                                    </div>
                                </div>
                                <div className="col-span-5 pr-4">
                                    <div className="text-sm font-medium text-slate-900 truncate" title={doc.name}>{doc.name}</div>
                                </div>
                                <div className="col-span-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                                        {doc.type}
                                    </span>
                                </div>
                                <div className="col-span-3 flex items-center justify-end gap-3">
                                    <span className="text-xs text-slate-500">{doc.date}</span>
                                    {getStatusIcon(doc.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
