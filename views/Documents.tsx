import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, Clock, AlertCircle, Trash2, Plus } from 'lucide-react';
import { addDocumentFromFile, getAllDocuments, deleteDocument, getDocumentBlob } from '../lib/indexedDb';

type Doc = {
    id: string;
    name: string;
    type: string;
    date: string;
    status: string;
    dataUrl?: string; // object URL created from blob
};

export const DocumentsView = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [alerts, setAlerts] = useState<Array<{ id: string; type: 'success'|'error'|'info'; text: string }>>([]);
    const [progressMap, setProgressMap] = useState<Record<string, number>>({});
    const createdUrls = useRef<string[]>([]);

    const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB

    const pushAlert = (type: 'success'|'error'|'info', text: string) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
        setAlerts(a => [...a, { id, type, text }]);
        // auto-dismiss after 6s
        setTimeout(() => setAlerts(a => a.filter(x => x.id !== id)), 6000);
    };

    useEffect(() => {
        (async () => {
            const rows = await getAllDocuments();
            const docs: Doc[] = rows.map(r => {
                const url = r.blob ? URL.createObjectURL(r.blob) : undefined;
                if (url) createdUrls.current.push(url);
                return { id: r.id, name: r.name, type: r.type, date: r.date, status: r.status, dataUrl: url };
            });
            setDocuments(docs);
        })();
        return () => {
            // revoke created object URLs
            createdUrls.current.forEach(u => URL.revokeObjectURL(u));
            createdUrls.current = [];
        };
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle size={18} className="text-green-500" />;
            case 'processing': return <Clock size={18} className="text-blue-500 animate-pulse" />;
            case 'error': return <AlertCircle size={18} className="text-red-500" />;
            default: return <Clock size={18} className="text-slate-400" />;
        }
    };

    const persistRemove = async (id: string) => {
        try {
            await deleteDocument(id);
        } catch (e) {
            console.error('Failed to delete doc', e);
        }
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const uploadToServer = (file: File, onProgress: (p: number) => void) => {
        return new Promise<{ url?: string; filename?: string }>((resolve, reject) => {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/upload');
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const json = JSON.parse(xhr.responseText);
                            resolve(json);
                        } catch (e) {
                            resolve({});
                        }
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                };
                xhr.onerror = () => reject(new Error('Network error'));
                xhr.upload.onprogress = (ev) => {
                    if (ev.lengthComputable) {
                        const pct = Math.round((ev.loaded / ev.total) * 100);
                        onProgress(pct);
                    }
                };
                const form = new FormData();
                form.append('file', file);
                xhr.send(form);
            } catch (err) {
                reject(err);
            }
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files || []);
        onIncomingFiles(files);
    };

    const onIncomingFiles = async (files: File[]) => {
        for (const file of files) {
            if (file.size > MAX_FILE_BYTES) {
                pushAlert('error', `${file.name} exceeds the ${Math.round(MAX_FILE_BYTES/1024/1024)}MB limit`);
                continue;
            }
            if (file.type !== 'application/pdf') {
                pushAlert('info', `${file.name} is not a PDF and was skipped`);
                continue;
            }
            // optimistically add to UI with processing status
            const tempId = `${Date.now()}-${Math.random().toString(36).slice(2,9)}`;
            const tempDoc: Doc = { id: tempId, name: file.name, type: 'PDF', date: new Date().toLocaleString(), status: 'processing' };
            setDocuments(prev => [tempDoc, ...prev]);

            // store in indexedDB and get record
            try {
                const rec = await addDocumentFromFile(file);
                const url = rec.blob ? URL.createObjectURL(rec.blob) : undefined;
                if (url) createdUrls.current.push(url);
                // update doc entry to completed locally
                setDocuments(prev => prev.map(d => d.id === tempId ? ({ id: rec.id, name: rec.name, type: rec.type, date: rec.date, status: 'completed', dataUrl: url }) : d ));
                // start backend upload with progress
                setProgressMap(m => ({ ...m, [rec.id]: 0 }));
                try {
                    const res = await uploadToServer(file, (p) => setProgressMap(m => ({ ...m, [rec.id]: p })));
                    setProgressMap(m => ({ ...m, [rec.id]: 100 }));
                    setDocuments(prev => prev.map(d => d.id === rec.id ? ({ ...d, status: 'completed' }) : d));
                    pushAlert('success', `${file.name} uploaded`);
                } catch (e) {
                    setDocuments(prev => prev.map(d => d.id === rec.id ? ({ ...d, status: 'error' }) : d));
                    pushAlert('error', `Upload failed for ${file.name}`);
                } finally {
                    // clear progress after short delay
                    setTimeout(() => setProgressMap(m => { const copy = { ...m }; delete copy[rec.id]; return copy; }), 2000);
                }
            } catch (err) {
                console.error('store failed', err);
                setDocuments(prev => prev.filter(d => d.id !== tempId));
                pushAlert('error', `Failed to store ${file.name}`);
            }
        }
    };

    const handleFiles = async (files: File[]) => {
        for (const file of files) {
            if (file.type !== 'application/pdf') continue;
            try {
                const rec = await addDocumentFromFile(file);
                const url = rec.blob ? URL.createObjectURL(rec.blob) : undefined;
                if (url) createdUrls.current.push(url);
                const doc: Doc = { id: rec.id, name: rec.name, type: rec.type, date: rec.date, status: rec.status, dataUrl: url };
                setDocuments(prev => [doc, ...prev]);
            } catch (e) {
                console.error('Failed to add document', e);
            }
        }
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        handleFiles(files);
        e.currentTarget.value = '';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Ingestão de Documentos (OCR)</h1>
                <p className="text-slate-500 mt-1">
                    Automate a entrada de dados financeiros a partir de documentos PDF e imagens. (Local demo: stored in localStorage)
                </p>
            </header>

            {/* Alerts */}
            <div className="fixed top-6 right-6 flex flex-col gap-2 z-50">
                {alerts.map(a => (
                    <div key={a.id} className={`px-4 py-2 rounded shadow-md text-sm ${a.type === 'error' ? 'bg-red-100 text-red-800' : a.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
                        {a.text}
                    </div>
                ))}
            </div>

            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer
          ${isDragging
                        ? 'border-pcfh-gold bg-pcfh-gold/5 scale-[1.02]'
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <UploadCloud size={36} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Arraste seus arquivos aqui</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Suporte para PDF. Arquivos serão mantidos localmente no seu navegador (demo). Máx: {Math.round(MAX_FILE_BYTES/1024/1024)}MB por arquivo.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <label className="inline-flex items-center gap-2 bg-pcfh-900 text-white px-4 py-2 rounded-lg cursor-pointer">
                        <Plus size={16} />
                        <span>Selecionar PDF</span>
                        <input type="file" accept="application/pdf" className="hidden" multiple onChange={onFileInputChange} />
                    </label>
                </div>
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <FileText size={20} className="text-slate-400" />
                        Arquivos Processados Recentemente
                    </h4>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 bg-slate-50 p-4 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-1"></div>
                        <div className="col-span-5">Nome do Arquivo</div>
                        <div className="col-span-3">Tipo</div>
                        <div className="col-span-3 text-right">Data / Ações</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {documents.map((doc) => (
                            <div key={doc.id} className="grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition">
                                <div className="col-span-1 flex justify-center">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <FileText size={20} />
                                    </div>
                                </div>
                                <div className="col-span-5 pr-4">
                                    <div className="text-sm font-medium text-slate-900 truncate" title={doc.name}>{doc.name}</div>
                                    {progressMap[doc.id] !== undefined && progressMap[doc.id] < 100 && (
                                        <div className="w-full h-2 bg-slate-100 rounded mt-2 overflow-hidden">
                                            <div style={{ width: `${progressMap[doc.id]}%` }} className="h-2 bg-pcfh-900" />
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-3">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                                        {doc.type}
                                    </span>
                                </div>
                                <div className="col-span-3 flex items-center justify-end gap-3">
                                    <span className="text-xs text-slate-500">{doc.date}</span>
                                    {getStatusIcon(doc.status)}
                                    {doc.dataUrl && (
                                        <a className="text-xs text-slate-600 underline ml-2" href={doc.dataUrl} download={doc.name}>Baixar</a>
                                    )}
                                    <button className="p-1 rounded hover:bg-slate-100 ml-2" onClick={() => persistRemove(doc.id)} title="Remover">
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {documents.length === 0 && (
                            <div className="p-6 text-center text-slate-500">Nenhum documento carregado ainda.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
