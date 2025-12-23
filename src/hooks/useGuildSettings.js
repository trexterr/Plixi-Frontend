import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboardData } from '../context/DashboardDataContext';
import { useSelectedGuild } from '../context/SelectedGuildContext';
import { useToast } from '../components/ToastProvider';

export default function useGuildSettings() {
  const { activeRecord, updateSection, resetSection, saveSection, revertGuildChanges } = useDashboardData();
  const { selectedGuild, isPremium } = useSelectedGuild();
  const { showToast } = useToast();
  const location = useLocation();

  const guild = activeRecord.settings.guild;
  const lastSaved = activeRecord.lastSaved.guild;

  const updateGuild = (producer) => {
    const next = typeof producer === 'function' ? producer(guild) : producer;
    updateSection('guild', next);
  };

  const saveGuild = async (message = 'Guild settings saved') => {
    try {
      const didSave = await saveSection('guild');
      if (didSave) {
        showToast(message);
      }
    } catch (error) {
      console.error('Failed to save guild settings', error?.causes ?? error);
      showToast('Failed to save guild settings', 'error');
    }
  };

  const resetGuild = (message = 'Guild settings reset', tone = 'info') => {
    resetSection('guild');
    showToast(message, tone);
  };

  useEffect(() => {
    if (!selectedGuild?.id) return;
    return () => {
      revertGuildChanges(selectedGuild.id);
    };
  }, [location.pathname, selectedGuild?.id, revertGuildChanges]);

  return useMemo(
    () => ({
      guild,
      lastSaved,
      updateGuild,
      saveGuild,
      resetGuild,
      selectedGuild,
      isPremium,
    }),
    [guild, lastSaved, selectedGuild, isPremium],
  );
}
