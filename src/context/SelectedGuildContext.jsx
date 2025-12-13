import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SelectedGuildContext = createContext(null);
const STORAGE_KEY = 'plixi-selected-guild';

export function SelectedGuildProvider({ guilds, user, children }) {
  const [selectedGuildId, setSelectedGuildId] = useState(() => {
    if (typeof window === 'undefined') {
      return guilds[0]?.id ?? null;
    }
    const cached = window.localStorage.getItem(STORAGE_KEY);
    const existsInGuilds = guilds.some((guild) => guild.id === cached);
    return existsInGuilds ? cached : guilds[0]?.id ?? null;
  });

  useEffect(() => {
    if (!selectedGuildId) return;
    window.localStorage.setItem(STORAGE_KEY, selectedGuildId);
  }, [selectedGuildId]);

  useEffect(() => {
    if (!guilds.length) return;
    if (!selectedGuildId || !guilds.some((guild) => guild.id === selectedGuildId)) {
      setSelectedGuildId(guilds[0].id);
    }
  }, [guilds, selectedGuildId]);

  const selectGuild = (guildId) => {
    setSelectedGuildId(guildId);
  };

  const selectedGuild = useMemo(
    () => guilds.find((guild) => guild.id === selectedGuildId) ?? guilds[0] ?? null,
    [guilds, selectedGuildId],
  );

  const value = useMemo(
    () => ({
      guilds,
      user,
      selectedGuild,
      selectedGuildId,
      isPremium: Boolean(selectedGuild?.premium),
      selectGuild,
    }),
    [guilds, user, selectedGuild, selectedGuildId],
  );

  return <SelectedGuildContext.Provider value={value}>{children}</SelectedGuildContext.Provider>;
}

export function useSelectedGuild() {
  const context = useContext(SelectedGuildContext);
  if (!context) {
    throw new Error('useSelectedGuild must be used within a SelectedGuildProvider');
  }
  return context;
}
