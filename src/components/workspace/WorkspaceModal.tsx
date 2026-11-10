/**
 * Google Workspace Integration Command Center (Vector Pacific)
 * Full client-side Google Drive, Gmail, and Keep-compatible Hardware Notes
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  HardDrive,
  Mail,
  FileText,
  Upload,
  RefreshCw,
  Trash2,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Pin,
  CheckSquare,
  Square,
  Download,
  Shield,
  Sparkles,
  Inbox
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  initGoogleAuth,
  signInWithGoogle,
  signOutGoogle,
  getGoogleAccessToken
} from '../../services/googleAuth';
import {
  listDriveFiles,
  uploadFileToDrive,
  deleteDriveFile,
  DriveFile
} from '../../services/googleDrive';
import {
  listGmailMessages,
  sendGmailMessage,
  GmailMessageSummary
} from '../../services/googleGmail';
import {
  HardwareNote,
  loadHardwareNotes,
  saveHardwareNotes
} from '../../services/hardwareNotes';
import { User } from 'firebase/auth';

export const WorkspaceModal: React.FC = () => {
  const {
    activeModal,
    closeModals,
    workspaceInitialTab,
    cart,
    cartTotalUSD,
    products,
    formatPrice,
    orders,
    addNotification
  } = useApp();

  // Active Tab: 'drive' | 'gmail' | 'keep'
  const [activeTab, setActiveTab] = useState<'drive' | 'gmail' | 'keep'>('drive');

  // Auth state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [driveActionStatus, setDriveActionStatus] = useState<string | null>(null);

  // Drive Deletion Confirmation Modal State (MANDATORY explicit confirmation)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeletingFile, setIsDeletingFile] = useState(false);

  // Gmail state
  const [gmailMessages, setGmailMessages] = useState<GmailMessageSummary[]>([]);
  const [loadingGmail, setLoadingGmail] = useState(false);
  const [emailTo, setEmailTo] = useState('tyevs399@gmail.com');
  const [emailSubject, setEmailSubject] = useState('Vector Pacific // Order Manifest & Hardware Spec Dossier');
  const [emailBody, setEmailBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'order' | 'radar' | 'bench' | 'note' | 'custom'>('order');
  const [gmailActionStatus, setGmailActionStatus] = useState<string | null>(null);

  // Gmail Send Confirmation Modal State (MANDATORY explicit confirmation)
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Hardware Notes (Keep-compatible) state
  const [notes, setNotes] = useState<HardwareNote[]>(() => loadHardwareNotes());
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState<HardwareNote['color']>('amber');
  const [newNoteTags, setNewNoteTags] = useState('Overclocking, BIOS');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [notesSyncStatus, setNotesSyncStatus] = useState<string | null>(null);

  // Initialize active tab from context whenever modal opens
  useEffect(() => {
    if (activeModal === 'workspace') {
      setActiveTab(workspaceInitialTab || 'drive');
    }
  }, [activeModal, workspaceInitialTab]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive and Gmail messages when authenticated and tab active
  const refreshDrive = useCallback(async (token = accessToken) => {
    if (!token) return;
    setLoadingDrive(true);
    setDriveActionStatus(null);
    try {
      const files = await listDriveFiles(token, 25, driveSearch);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error fetching Drive files:', err);
      setDriveActionStatus(`Drive read error: ${err.message || 'Check scopes'}`);
    } finally {
      setLoadingDrive(false);
    }
  }, [accessToken, driveSearch]);

  const refreshGmail = useCallback(async (token = accessToken) => {
    if (!token) return;
    setLoadingGmail(true);
    setGmailActionStatus(null);
    try {
      const messages = await listGmailMessages(token, 6);
      setGmailMessages(messages);
    } catch (err: any) {
      console.error('Error fetching Gmail messages:', err);
      setGmailActionStatus(`Gmail read error: ${err.message || 'Check scopes'}`);
    } finally {
      setLoadingGmail(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (activeModal === 'workspace' && accessToken) {
      if (activeTab === 'drive') {
        refreshDrive(accessToken);
      } else if (activeTab === 'gmail') {
        refreshGmail(accessToken);
      }
    }
  }, [activeModal, activeTab, accessToken, refreshDrive, refreshGmail]);

  // Pre-fill email templates
  useEffect(() => {
    if (selectedTemplate === 'order') {
      const latestOrder = orders.length > 0 ? orders[0] : null;
      setEmailSubject('Vector Pacific // Order Manifest & Hardware Verification');
      setEmailBody(
        `<h3>Order Manifest #${latestOrder ? latestOrder.id : 'ORD-2026-LIVE'}</h3>` +
        `<p><strong>Status:</strong> ${latestOrder ? latestOrder.status : 'Processing'}<br/>` +
        `<strong>Total Value:</strong> $${latestOrder ? latestOrder.totalUSD.toLocaleString() : cartTotalUSD.toLocaleString()} USD<br/>` +
        `<strong>Tracking Number:</strong> ${latestOrder ? latestOrder.trackingNumber : 'AETH-99214X'}</p>` +
        `<h4>Hardware Items:</h4>` +
        `<ul>${(cart.length > 0 ? cart : [
          { productId: 'razer-blade-18-2026', quantity: 1 }
        ]).map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          return `<li><strong>${prod ? prod.name : item.productId}</strong> (Qty: ${item.quantity}) - $${prod ? prod.price.toLocaleString() : 0}</li>`;
        }).join('')}</ul>` +
        `<p>Verified by Vector Pacific Hardware Labs, Silicon Valley.</p>`
      );
    } else if (selectedTemplate === 'radar') {
      setEmailSubject('Vector Pacific // Price Radar Drop Alert: Wooting 80HE (-15%)');
      setEmailBody(
        `<h3>⚡ PRICE RADAR DROP NOTIFICATION</h3>` +
        `<p>A monitored hardware component has dropped below your configured price threshold!</p>` +
        `<p><strong>Item:</strong> Wooting 80HE Rapid Trigger Keyboard<br/>` +
        `<strong>Current Price:</strong> $289.00 USD (Was $340.00 USD)<br/>` +
        `<strong>Warehouse Stock:</strong> 12 units remaining in NV-01 facility.</p>` +
        `<p>Order immediate dispatch via Vector Pacific Express Logistics.</p>`
      );
    } else if (selectedTemplate === 'bench') {
      setEmailSubject('Vector Pacific // Cinebench R24 & Geekbench 6 Performance Dossier');
      setEmailBody(
        `<h3>🔬 HARDWARE LAB BENCHMARK DOSSIER</h3>` +
        `<p>Performance analysis generated by Vector Pacific Hardware Simulation Engine:</p>` +
        `<ul>` +
        `<li><strong>Cinebench R24 Multi-Core:</strong> 2,210 pts (99th percentile enthusiast tier)</li>` +
        `<li><strong>Cinebench R24 Single-Core:</strong> 142 pts (+18% vs standard reference)</li>` +
        `<li><strong>Geekbench 6 Multi-Core:</strong> 22,480 pts</li>` +
        `<li><strong>Thermal Stability:</strong> Sustained 81°C under 100% 30-min continuous load</li>` +
        `</ul>` +
        `<p>Optimal fan acoustic profile: 42 dB(A) at 5.4 GHz all-core boost.</p>`
      );
    } else if (selectedTemplate === 'note') {
      const topNote = notes[0];
      setEmailSubject(`Vector Pacific Note // ${topNote ? topNote.title : 'Overclocking Sheet'}`);
      setEmailBody(
        `<h3>${topNote ? topNote.title : 'Builder Note'}</h3>` +
        `<p>${topNote ? topNote.content : 'No note content available.'}</p>` +
        `${topNote?.checklist ? `<h4>Checklist:</h4><ul>${topNote.checklist.map((c) => `<li>${c.done ? '✓' : '☐'} ${c.text}</li>`).join('')}</ul>` : ''}`
      );
    }
  }, [selectedTemplate, orders, cart, cartTotalUSD, products, notes]);

  // Auth Handlers
  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await signInWithGoogle();
      setGoogleUser(res.user);
      setAccessToken(res.accessToken);
      addNotification('Google Workspace Connected', `Authenticated as ${res.user.email} with Drive & Gmail scopes.`, 'system');
      if (activeTab === 'drive') refreshDrive(res.accessToken);
      if (activeTab === 'gmail') refreshGmail(res.accessToken);
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err.message || 'Failed to authenticate with Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setDriveFiles([]);
    setGmailMessages([]);
    addNotification('Google Disconnected', 'Signed out and in-memory access token cleared.', 'system');
  };

  // Quick Drive Backup Handlers
  const handleBackupCartToDrive = async () => {
    if (!accessToken) return;
    setLoadingDrive(true);
    try {
      const filename = `Vector_Pacific_Cart_Manifest_${new Date().toISOString().split('T')[0]}.json`;
      const manifestData = {
        platform: 'Vector Pacific',
        timestamp: new Date().toISOString(),
        currency: 'USD',
        totalUSD: cartTotalUSD,
        itemsCount: cart.length,
        items: cart.map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          return {
            productId: item.productId,
            name: prod?.name || item.productId,
            priceUSD: prod?.price || 0,
            quantity: item.quantity,
            subtotalUSD: (prod?.price || 0) * item.quantity
          };
        })
      };

      await uploadFileToDrive(accessToken, filename, 'application/json', JSON.stringify(manifestData, null, 2));
      setDriveActionStatus(`✓ Successfully backed up manifest "${filename}" to Google Drive!`);
      addNotification('Drive Backup Created', `Saved ${filename} directly into your Google Drive root.`, 'system');
      await refreshDrive();
    } catch (err: any) {
      setDriveActionStatus(`Upload failed: ${err.message}`);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleBackupBenchmarkToDrive = async () => {
    if (!accessToken) return;
    setLoadingDrive(true);
    try {
      const filename = `Vector_Pacific_Benchmark_Report_${new Date().toISOString().split('T')[0]}.md`;
      const mdContent = `# Vector Pacific // Benchmark Lab Performance Dossier
**Generated:** ${new Date().toLocaleString()}
**Platform:** Vector Pacific Enthusiast Architecture
**Target System:** Flagship Enthusiast Laptop (RTX 5090 Mobile + Core i9-14900HX)

## Standardized Benchmark Scores
- **Cinebench R24 Multi-Core:** 2,240 pts (Delta: +19.2% vs Mobile Average)
- **Cinebench R24 Single-Core:** 142 pts
- **Geekbench 6 Multi-Core:** 22,650 pts
- **Geekbench 6 Single-Core:** 3,240 pts
- **3DMark Time Spy Graphics:** 24,180 pts
- **Thermal Steady State:** 81.4°C @ 175W Sustained TGP

## Thermal & Acoustic Analysis
Vapor chamber liquid metal cooling maintains acoustic profile under 43 dB(A) under full load. Recommended for competitive simulation and ray tracing workloads.
`;

      await uploadFileToDrive(accessToken, filename, 'text/markdown', mdContent);
      setDriveActionStatus(`✓ Benchmark Dossier "${filename}" saved to Google Drive!`);
      addNotification('Benchmark Report Uploaded', `Saved ${filename} to your Google Drive.`, 'system');
      await refreshDrive();
    } catch (err: any) {
      setDriveActionStatus(`Upload failed: ${err.message}`);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleExportNotesToDrive = async () => {
    if (!accessToken) return;
    setLoadingDrive(true);
    try {
      const filename = `Vector_Pacific_Keep_Notes_${new Date().toISOString().split('T')[0]}.json`;
      const notesData = {
        platform: 'Vector Pacific',
        exportedAt: new Date().toISOString(),
        totalNotes: notes.length,
        notes
      };

      await uploadFileToDrive(accessToken, filename, 'application/json', JSON.stringify(notesData, null, 2));
      setDriveActionStatus(`✓ Synchronized ${notes.length} Hardware Notes to "${filename}" in Google Drive!`);
      setNotesSyncStatus(`Cloud sync confirmed at ${new Date().toLocaleTimeString()}`);
      addNotification('Notes Synced to Drive', `Backed up ${notes.length} builder scratchpads to Google Drive.`, 'system');
      await refreshDrive();
    } catch (err: any) {
      setDriveActionStatus(`Notes sync failed: ${err.message}`);
    } finally {
      setLoadingDrive(false);
    }
  };

  // Delete Drive File (Triggered after user clicks "Confirm Delete" in confirmation dialog)
  const confirmDeleteFile = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeletingFile(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setDriveActionStatus(`✓ File "${fileToDelete.name}" permanently deleted from Google Drive.`);
      addNotification('File Deleted from Drive', `Removed ${fileToDelete.name}.`, 'system');
      setFileToDelete(null);
      await refreshDrive();
    } catch (err: any) {
      setDriveActionStatus(`Failed to delete file: ${err.message}`);
    } finally {
      setIsDeletingFile(false);
    }
  };

  // Gmail Send Confirmation Trigger
  const handleInitiateEmailSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) {
      setGmailActionStatus('Please fill in recipient, subject, and message body.');
      return;
    }
    // Open mandatory confirmation dialog
    setShowSendConfirm(true);
  };

  // Actual Email Send (Dispatched only upon user confirmation)
  const confirmSendEmail = async () => {
    if (!accessToken) return;
    setIsSendingEmail(true);
    try {
      const result = await sendGmailMessage(
        accessToken,
        emailTo.trim(),
        emailSubject.trim(),
        emailBody.replace(/<[^>]*>?/gm, ''), // Plain text fallback
        emailBody // HTML body
      );

      setGmailActionStatus(`✓ Email successfully dispatched via Gmail! (Message ID: ${result.id.substring(0, 12)}...)`);
      addNotification('Gmail Dispatched', `Message sent to ${emailTo}.`, 'system');
      setShowSendConfirm(false);
      await refreshGmail();
    } catch (err: any) {
      setGmailActionStatus(`Send failed: ${err.message}`);
      setShowSendConfirm(false);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Hardware Notes operations
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: HardwareNote = {
      id: `note-${Date.now()}`,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      color: newNoteColor,
      pinned: false,
      tags: newNoteTags.split(',').map((t) => t.trim()).filter(Boolean),
      checklist: [
        { id: `c-${Date.now()}-1`, text: 'Validate baseline stability', done: false },
        { id: `c-${Date.now()}-2`, text: 'Record thermal delta @ steady state', done: false }
      ],
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveHardwareNotes(updated);

    setNewNoteTitle('');
    setNewNoteContent('');
    setIsCreatingNote(false);
    addNotification('Hardware Note Created', `Added "${newNote.title}" to local scratchpad.`, 'system');
  };

  const toggleChecklistItem = (noteId: string, checkId: string) => {
    const updated = notes.map((note) => {
      if (note.id !== noteId || !note.checklist) return note;
      return {
        ...note,
        checklist: note.checklist.map((item) =>
          item.id === checkId ? { ...item, done: !item.done } : item
        )
      };
    });
    setNotes(updated);
    saveHardwareNotes(updated);
  };

  const togglePinNote = (noteId: string) => {
    const updated = notes.map((note) =>
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    );
    setNotes(updated);
    saveHardwareNotes(updated);
  };

  const deleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);
    saveHardwareNotes(updated);
  };

  const emailThisNote = (note: HardwareNote) => {
    setSelectedTemplate('note');
    setEmailSubject(`Vector Pacific Note // ${note.title}`);
    setEmailBody(
      `<h3>${note.title}</h3>` +
      `<p>${note.content}</p>` +
      `${note.checklist ? `<h4>Checklist:</h4><ul>${note.checklist.map((c) => `<li>${c.done ? '✓' : '☐'} ${c.text}</li>`).join('')}</ul>` : ''}`
    );
    setActiveTab('gmail');
  };

  if (activeModal !== 'workspace') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#0f141f] border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#121724] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  Google Workspace Command Center
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Client-Side OAuth
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct integration with Google Drive, Gmail, and Keep-compatible hardware scratchpads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile or Sign-in button */}
            {googleUser ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
                    {googleUser.email ? googleUser.email[0].toUpperCase() : 'G'}
                  </div>
                )}
                <span className="text-slate-300 font-mono hidden sm:inline text-[11px] truncate max-w-[130px]">
                  {googleUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 ml-1 transition-colors"
                  title="Sign out of Google"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Official Google Material Sign-In Button */
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button text-xs"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg viewBox="0 0 48 48" style={{ display: 'block', width: '18px', height: '18px' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    {isLoggingIn ? 'Connecting...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={closeModals}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-3 border-b border-slate-800/80 bg-[#121724]/60 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2.5 text-xs font-mono font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'drive'
                ? 'text-amber-400 border-amber-500 bg-[#0f141f]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Drive Explorer</span>
            {driveFiles.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                {driveFiles.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('gmail')}
            className={`px-4 py-2.5 text-xs font-mono font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'gmail'
                ? 'text-amber-400 border-amber-500 bg-[#0f141f]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail Dispatch Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('keep')}
            className={`px-4 py-2.5 text-xs font-mono font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'keep'
                ? 'text-amber-400 border-amber-500 bg-[#0f141f]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Hardware Keep Scratchpad</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/10 text-amber-400">
              {notes.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 font-mono">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Unauthenticated Prompt Banner if no access token */}
          {!accessToken && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-amber-950/30 border border-blue-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-white">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Authorize Vector Pacific Google Workspace Access</span>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Connect your Google account with permission to save hardware manifests to Google Drive, send order receipts and benchmark sheets via Gmail, and synchronize enthusiast build notes. Tokens are held securely in-memory and never stored on disk.
                </p>
              </div>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button shrink-0"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg viewBox="0 0 48 48" style={{ display: 'block', width: '18px', height: '18px' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    {isLoggingIn ? 'Authenticating...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: GOOGLE DRIVE EXPLORER                              */}
          {/* ========================================================= */}
          {activeTab === 'drive' && (
            <div className="space-y-6">
              
              {/* Quick 1-Click Backup Action Strip */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    1-CLICK CLOUD SYNC & BACKUP TO GOOGLE DRIVE
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Direct Multipart REST v3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleBackupCartToDrive}
                    disabled={!accessToken || loadingDrive}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-left transition-all disabled:opacity-50 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white font-mono group-hover:text-amber-400 transition-colors">
                          Backup Cart Manifest
                        </span>
                        <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Uploads current cart items & pricing as JSON to your Google Drive root.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400/80 mt-2 block">
                      {cart.length} item(s) • ${cartTotalUSD.toLocaleString()} USD
                    </span>
                  </button>

                  <button
                    onClick={handleBackupBenchmarkToDrive}
                    disabled={!accessToken || loadingDrive}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all disabled:opacity-50 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                          Save Benchmark Dossier
                        </span>
                        <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Exports Cinebench & Geekbench lab simulation sheet in formatted Markdown.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400/80 mt-2 block">
                      Cinebench R24 & Geekbench 6
                    </span>
                  </button>

                  <button
                    onClick={handleExportNotesToDrive}
                    disabled={!accessToken || loadingDrive}
                    className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/40 text-left transition-all disabled:opacity-50 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white font-mono group-hover:text-purple-400 transition-colors">
                          Sync Hardware Notes
                        </span>
                        <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Saves all your OC profiles & build checklists to Drive as a persistent backup.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400/80 mt-2 block">
                      {notes.length} note scratchpads
                    </span>
                  </button>
                </div>

                {driveActionStatus && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between">
                    <span>{driveActionStatus}</span>
                    <button
                      onClick={() => setDriveActionStatus(null)}
                      className="text-amber-400/80 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Drive File Browser */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search Drive files..."
                      value={driveSearch}
                      onChange={(e) => setDriveSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && refreshDrive()}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <button
                    onClick={() => refreshDrive()}
                    disabled={!accessToken || loadingDrive}
                    className="w-full sm:w-auto px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingDrive ? 'animate-spin text-amber-400' : ''}`} />
                    <span>Refresh Drive Files</span>
                  </button>
                </div>

                {/* File Table */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                  {loadingDrive && driveFiles.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs font-mono space-y-2">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                      <p>Querying Google Drive files via v3 API...</p>
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs font-mono space-y-2">
                      <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                      <p>{accessToken ? 'No matching files found in your Google Drive.' : 'Sign in with Google above to explore your Drive files.'}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#121724] text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-4">File Name</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Size</th>
                            <th className="py-2.5 px-3">Last Modified</th>
                            <th className="py-2.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {driveFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-4 text-white font-medium flex items-center gap-2 max-w-[260px] truncate">
                                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="truncate" title={file.name}>{file.name}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[140px]">
                                {file.mimeType.split('/').pop() || file.mimeType}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                {file.size ? `${(parseInt(file.size, 10) / 1024).toFixed(1)} KB` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                                {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                              </td>
                              <td className="py-2.5 px-4 text-right space-x-2 shrink-0">
                                {file.webViewLink && (
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    title="Open file in Google Drive"
                                  >
                                    <span>Open</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                <button
                                  onClick={() => setFileToDelete(file)}
                                  className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors inline-block"
                                  title="Delete from Google Drive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: GMAIL DISPATCH HUB                                 */}
          {/* ========================================================= */}
          {activeTab === 'gmail' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Email Compose Form (2 Cols) */}
                <div className="lg:col-span-2 space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-white">
                        Dispatch Email via Gmail API
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      RFC 2822 Base64url Handshake
                    </span>
                  </div>

                  {/* Template Picker */}
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1.5">
                      PRESET ENTHUSIAST TEMPLATE
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { id: 'order', label: 'Order Manifest' },
                        { id: 'radar', label: 'Price Drop' },
                        { id: 'bench', label: 'Benchmark Lab' },
                        { id: 'note', label: 'Build Note' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTemplate(t.id as any)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors text-center border ${
                            selectedTemplate === t.id
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 font-semibold'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleInitiateEmailSend} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        RECIPIENT EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        placeholder="e.g. tyevs399@gmail.com"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        SUBJECT LINE
                      </label>
                      <input
                        type="text"
                        required
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Subject..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        HTML EMAIL BODY (PREVIEW & EDIT)
                      </label>
                      <textarea
                        rows={7}
                        required
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                      />
                    </div>

                    {gmailActionStatus && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                        {gmailActionStatus}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <p className="text-[11px] text-slate-400 font-mono">
                        ⚠️ Confirmation barrier is mandatory before dispatch.
                      </p>
                      <button
                        type="submit"
                        disabled={!accessToken || isSendingEmail}
                        className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send via Gmail</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Mailbox Feed / Recent Activity (1 Col) */}
                <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-mono font-bold text-white">
                          Recent Mailbox Feed
                        </span>
                      </div>
                      <button
                        onClick={() => refreshGmail()}
                        disabled={!accessToken || loadingGmail}
                        className="text-slate-400 hover:text-white p-1 rounded"
                        title="Refresh Gmail feed"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingGmail ? 'animate-spin text-amber-400' : ''}`} />
                      </button>
                    </div>

                    {loadingGmail && gmailMessages.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs font-mono space-y-1">
                        <RefreshCw className="w-4 h-4 animate-spin mx-auto text-amber-400" />
                        <p>Syncing recent threads...</p>
                      </div>
                    ) : gmailMessages.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs font-mono">
                        <p>{accessToken ? 'No recent messages found.' : 'Sign in with Google to view mailbox activity.'}</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                        {gmailMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1 hover:border-blue-500/30 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-white truncate max-w-[140px]">
                                {msg.from ? msg.from.split('<')[0].replace(/"/g, '') : 'Inbox'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {msg.date ? new Date(msg.date).toLocaleDateString([], { month: 'numeric', day: 'numeric' }) : ''}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-amber-400/90 truncate">
                              {msg.subject || '(No Subject)'}
                            </p>
                            {msg.snippet && (
                              <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                                {msg.snippet}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                    Target User Email: <span className="text-slate-300">tyevs399@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: HARDWARE KEEP NOTES & SCRATCHPAD                   */}
          {/* ========================================================= */}
          {activeTab === 'keep' && (
            <div className="space-y-6">
              
              {/* Architecture Info Notice */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 text-slate-300 text-xs space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-blue-400">
                  <Shield className="w-4 h-4" />
                  <span>Google Keep Workflow via Connected Google Drive & Gmail</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  The direct Google Keep API (<code className="text-amber-300 font-mono">keep.googleapis.com</code>) is an enterprise-only service requiring GSuite domain-wide delegation (consumer @gmail accounts reject Keep scopes). Vector Pacific seamlessly gives you the complete Keep workflow by synchronizing your builder scratchpad directly to your personal <strong className="text-white">Google Drive</strong> as JSON/Markdown dossiers, plus 1-click dispatch to teammates via <strong className="text-white">Gmail</strong>.
                </p>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCreatingNote(!isCreatingNote)}
                    className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isCreatingNote ? 'Cancel' : 'New Hardware Note'}</span>
                  </button>

                  <button
                    onClick={handleExportNotesToDrive}
                    disabled={!accessToken || loadingDrive}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sync All Notes to Drive</span>
                  </button>
                </div>

                {notesSyncStatus && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{notesSyncStatus}</span>
                  </span>
                )}
              </div>

              {/* Note Creation Form Drawer */}
              {isCreatingNote && (
                <form
                  onSubmit={handleCreateNote}
                  className="p-4 rounded-xl border border-amber-500/30 bg-slate-900/90 space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono font-bold text-white">Create Builder Scratchpad Note</span>
                    {/* Color Picker */}
                    <div className="flex items-center gap-1.5">
                      {(['amber', 'blue', 'purple', 'emerald', 'slate'] as const).map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewNoteColor(color)}
                          className={`w-4 h-4 rounded-full transition-transform ${
                            color === 'amber' ? 'bg-amber-500' :
                            color === 'blue' ? 'bg-blue-500' :
                            color === 'purple' ? 'bg-purple-500' :
                            color === 'emerald' ? 'bg-emerald-500' : 'bg-slate-500'
                          } ${newNoteColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Note Title (e.g. RTX 5090 Thermal Offsets)"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />

                  <textarea
                    rows={3}
                    required
                    placeholder="Detailed hardware notes, voltages, clock speeds, benchmarks..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                  />

                  <input
                    type="text"
                    placeholder="Tags (comma separated, e.g. BIOS, OC, Thermals)"
                    value={newNoteTags}
                    onChange={(e) => setNewNoteTags(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNote(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold text-xs"
                    >
                      Save Scratchpad
                    </button>
                  </div>
                </form>
              )}

              {/* Notes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((note) => {
                  const borderClass =
                    note.color === 'amber' ? 'border-amber-500/40 bg-amber-950/10' :
                    note.color === 'blue' ? 'border-blue-500/40 bg-blue-950/10' :
                    note.color === 'purple' ? 'border-purple-500/40 bg-purple-950/10' :
                    note.color === 'emerald' ? 'border-emerald-500/40 bg-emerald-950/10' :
                    'border-slate-700 bg-slate-900/60';

                  return (
                    <div
                      key={note.id}
                      className={`p-4 rounded-xl border ${borderClass} flex flex-col justify-between space-y-3 relative group transition-all`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white font-mono leading-tight">
                            {note.title}
                          </h4>
                          <button
                            onClick={() => togglePinNote(note.id)}
                            className={`p-1 rounded hover:bg-slate-800 transition-colors ${note.pinned ? 'text-amber-400' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`}
                            title="Pin note"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                          {note.content}
                        </p>

                        {/* Checklists */}
                        {note.checklist && note.checklist.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/60 space-y-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                              Validation Checklist
                            </span>
                            {note.checklist.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => toggleChecklistItem(note.id, item.id)}
                                className="w-full flex items-center gap-2 text-left text-[11px] text-slate-300 hover:text-white transition-colors"
                              >
                                {item.done ? (
                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                )}
                                <span className={item.done ? 'line-through text-slate-500' : ''}>
                                  {item.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Tag Chips */}
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {note.tags.map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>{note.updatedAt}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => emailThisNote(note)}
                            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                            title="Email note via Gmail"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar Status */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#121724] flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {googleUser ? `Connected: ${googleUser.email}` : 'Google Workspace Ready'}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline">Project: gen-lang-client-0296392916</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeModals}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              Close Hub
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MANDATORY CONFIRMATION MODAL 1: GOOGLE DRIVE FILE DELETE   */}
      {/* ========================================================= */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#121724] border border-red-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  Confirm Google Drive File Deletion
                </h3>
                <span className="text-[11px] text-red-400/90 font-mono">
                  Permanent Workspace Action
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white font-mono font-bold">"{fileToDelete.name}"</strong> from your Google Drive? This will remove the file from your Google cloud storage and cannot be undone.
            </p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div>File ID: <span className="text-slate-300">{fileToDelete.id}</span></div>
              <div>Type: <span className="text-slate-300">{fileToDelete.mimeType}</span></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeletingFile}
                className="px-4 py-2 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeletingFile}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/50 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingFile ? 'Deleting...' : 'Permanently Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MANDATORY CONFIRMATION MODAL 2: GMAIL EMAIL DISPATCH      */}
      {/* ========================================================= */}
      {showSendConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#121724] border border-amber-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Send className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  Confirm Outbound Gmail Dispatch
                </h3>
                <span className="text-[11px] text-amber-400/90 font-mono">
                  Will send email on your behalf
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Vector Pacific will send an email through your connected Google Workspace account (<span className="text-white font-mono">{googleUser?.email || 'authenticated user'}</span>).
            </p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-slate-400">Recipient: <strong className="text-white">{emailTo}</strong></div>
              <div className="text-slate-400">Subject: <strong className="text-amber-400">{emailSubject}</strong></div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSendConfirm(false)}
                disabled={isSendingEmail}
                className="px-4 py-2 rounded-lg text-xs font-mono text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSendEmail}
                disabled={isSendingEmail}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-950/50 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingEmail ? 'Dispatching...' : 'Confirm & Send Email'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
