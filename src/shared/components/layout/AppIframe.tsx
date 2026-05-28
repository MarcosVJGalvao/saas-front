import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

export type AppIframeProps = BoxProps<'iframe'>;

export const AppIframe = (props: AppIframeProps) => <Box component="iframe" {...props} />;
