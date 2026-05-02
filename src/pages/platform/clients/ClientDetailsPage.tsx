import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { useClientDetails } from '../../../hooks/clients/useClientDetails';

const ClientDetailsPage = () => {
  const { id } = useParams();
  const { data } = useClientDetails(id);
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Detalhes do Cliente</Typography>
      {data ? (
        <>
          <Typography>{data.legalName}</Typography>
          <Typography>{data.email}</Typography>
          <Typography>{data.documentNumber}</Typography>
        </>
      ) : (
        <Typography>Carregando...</Typography>
      )}
    </Stack>
  );
};

export default ClientDetailsPage;
