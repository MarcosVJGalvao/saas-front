import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface AppTabsItem {
  label: string;
  value: string;
}

interface AppTabsProps {
  tabs: AppTabsItem[];
  value: string;
  onChange: (nextValue: string) => void;
}

export const AppTabs = ({ tabs, value, onChange }: AppTabsProps) => (
  <Tabs value={value} onChange={(_, next) => onChange(String(next))}>
    {tabs.map((tab) => (
      <Tab key={tab.value} value={tab.value} label={tab.label} />
    ))}
  </Tabs>
);
