export type StampBookEntry = {
  state: "pending" | "revealed";
  earnedAt: string;
  revealedAt?: string;
  updatedAt: string;
};

export type StampBookState = {
  version: 1;
  createdAt: string;
  updatedAt: string;
  stamps: Record<string, StampBookEntry>;
};

const nowIso = (): string => new Date().toISOString();

export const createStampBook = (now = nowIso()): StampBookState => ({
  version: 1,
  createdAt: now,
  updatedAt: now,
  stamps: {},
});

export const earnStamp = (
  state: StampBookState,
  stampId: string,
  now = nowIso(),
): StampBookState => {
  if (state.stamps[stampId]) return state;

  return {
    ...state,
    updatedAt: now,
    stamps: {
      ...state.stamps,
      [stampId]: {
        state: "pending",
        earnedAt: now,
        updatedAt: now,
      },
    },
  };
};

export const revealStamp = (
  state: StampBookState,
  stampId: string,
  now = nowIso(),
): StampBookState => {
  const stamp = state.stamps[stampId];
  if (!stamp || stamp.state === "revealed") return state;

  return {
    ...state,
    updatedAt: now,
    stamps: {
      ...state.stamps,
      [stampId]: {
        ...stamp,
        state: "revealed",
        revealedAt: now,
        updatedAt: now,
      },
    },
  };
};

export const serializeStampBook = (state: StampBookState): string =>
  JSON.stringify(state, null, 2);

export const parseStampBook = (value: string): StampBookState | undefined => {
  try {
    const parsed = JSON.parse(value) as Partial<StampBookState>;
    if (parsed.version !== 1 || !parsed.createdAt || !parsed.updatedAt) {
      return undefined;
    }
    return {
      version: 1,
      createdAt: parsed.createdAt,
      updatedAt: parsed.updatedAt,
      stamps: parsed.stamps ?? {},
    };
  } catch {
    return undefined;
  }
};
