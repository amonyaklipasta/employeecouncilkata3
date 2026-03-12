import { create } from 'zustand';
import { MOCK_USERS, SEED_TICKETS, NEXT_STAGE, TERMINAL_STAGES, PUBLIC_STAGES } from '../data/mockData';
import type { Ticket, TicketStatus, AuditEntry, MockUser, CommonalityGrade, TicketTransition } from '../data/mockData';

interface AppState {
  loggedIn: boolean;
  currentUser: MockUser;
  darkMode: boolean;
  tickets: Ticket[];
  auditLog: AuditEntry[];

  login: (userId: string) => void;
  logout: () => void;
  switchRole: (userId: string) => void;
  toggleDarkMode: () => void;
  submitTicket: (t: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'votes' | 'transitions'> & { grade?: CommonalityGrade; isUrgent?: boolean; urgencyNote?: string }) => Ticket;
  advanceTicket: (id: string, note?: string) => void;
  declineTicket: (id: string, reason: string) => void;
  mergeTicket: (id: string, mergedInto: string) => void;
  voteTicket: (id: string) => void;
  visibleTickets: () => Ticket[];
}

let ticketCounter = SEED_TICKETS.length + 1;
let auditCounter  = 1;
const newTicketId = () => `T-${1000 + ticketCounter++}`;
const newAuditId  = () => `A-${auditCounter++}`;
const isoNow      = () => new Date().toISOString();

function makeTransition(from: TicketStatus, to: TicketStatus, actor: string, note?: string): TicketTransition {
  return { from, to, actor, timestamp: isoNow(), note };
}

export const useStore = create<AppState>((set, get) => ({
  loggedIn: false,
  currentUser: MOCK_USERS[0],
  darkMode: false,
  tickets: [...SEED_TICKETS],
  auditLog: [],

  login: (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId) ?? MOCK_USERS[0];
    set({ loggedIn: true, currentUser: user });
  },
  logout: () => set({ loggedIn: false }),
  switchRole: (userId) => {
    const user = MOCK_USERS.find((u) => u.id === userId) ?? MOCK_USERS[0];
    set({ currentUser: user });
  },
  toggleDarkMode: () => {
    const next = !get().darkMode;
    document.documentElement.classList.toggle('dark', next);
    set({ darkMode: next });
  },

  submitTicket: (partial) => {
    const ticket: Ticket = {
      ...partial,
      id: newTicketId(),
      status: 'submitted',
      createdAt: isoNow(),
      votes: [],
      transitions: [],
    };
    set((s) => ({
      tickets: [...s.tickets, ticket],
      auditLog: [...s.auditLog, {
        id: newAuditId(), timestamp: isoNow(),
        actor: get().currentUser.name, action: 'Submitted ticket',
        ticketTitle: ticket.title, ticketId: ticket.id,
      }],
    }));
    return ticket;
  },

  advanceTicket: (id, note) => {
    const { tickets, currentUser } = get();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || TERMINAL_STAGES.includes(ticket.status)) return;
    const next = NEXT_STAGE[ticket.status];
    if (!next) return;
    const transition = makeTransition(ticket.status, next, currentUser.name, note);
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id ? { ...t, status: next, transitions: [...t.transitions, transition] } : t
      ),
      auditLog: [...s.auditLog, {
        id: newAuditId(), timestamp: isoNow(),
        actor: currentUser.name, action: `→ ${next.replace('_', ' ')}`,
        ticketTitle: ticket.title, ticketId: id,
      }],
    }));
  },

  declineTicket: (id, reason) => {
    const { tickets, currentUser } = get();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;
    const transition = makeTransition(ticket.status, 'declined', currentUser.name, reason);
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id ? { ...t, status: 'declined', declineReason: reason, transitions: [...t.transitions, transition] } : t
      ),
      auditLog: [...s.auditLog, {
        id: newAuditId(), timestamp: isoNow(),
        actor: currentUser.name, action: 'Declined ticket',
        ticketTitle: ticket.title, ticketId: id,
      }],
    }));
  },

  mergeTicket: (id, mergedInto) => {
    const { tickets, currentUser } = get();
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;
    const transition = makeTransition(ticket.status, 'merged', currentUser.name, `Merged into ${mergedInto}`);
    set((s) => ({
      tickets: s.tickets.map((t) =>
        t.id === id ? { ...t, status: 'merged', mergedInto, transitions: [...t.transitions, transition] } : t
      ),
      auditLog: [...s.auditLog, {
        id: newAuditId(), timestamp: isoNow(),
        actor: currentUser.name, action: `Merged into ${mergedInto}`,
        ticketTitle: ticket.title, ticketId: id,
      }],
    }));
  },

  voteTicket: (id) => {
    const userId = get().currentUser.id;
    set((s) => ({
      tickets: s.tickets.map((t) => {
        if (t.id !== id) return t;
        const hasVoted = t.votes.includes(userId);
        return { ...t, votes: hasVoted ? t.votes.filter((v) => v !== userId) : [...t.votes, userId] };
      }),
    }));
  },

  visibleTickets: () => {
    const { currentUser, tickets } = get();
    if (currentUser.role === 'council') return tickets;
    return tickets.filter(
      (t) => PUBLIC_STAGES.includes(t.status) || t.submittedBy === currentUser.id
    );
  },
}));
