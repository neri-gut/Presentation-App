import {
  Container,
  Title,
  Text,
  Group,
  Grid,
  Card,
  Button,
  ActionIcon,
  Tooltip,
  Stack,
} from '@mantine/core';
import { 
  IconSettings, 
  IconRefresh, 
  IconMaximize,
  IconPresentation,
  IconVideo,
  IconPhoto,
  IconUsers
} from '@tabler/icons-react';

import { useUserStore } from '../../stores/userStore';
import { useMeetingStore } from '../../stores/meetingStore';

export default function Dashboard() {
  const { session } = useUserStore();
  const { currentTemplate, timerState } = useMeetingStore();
  const currentUser = session.currentUser;

  const handleOpenSpeakerDisplay = () => {
    // Abrir pantalla del orador en nueva ventana
    window.open('/speaker-display', '_blank', 'fullscreen=yes');
  };

  const handleStartPresentation = () => {
    // TODO: Implementar inicio de presentación
    console.log('Iniciar presentación');
  };

  const handleManageMedia = () => {
    // TODO: Implementar gestión de medios
    console.log('Gestionar medios');
  };

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={1}>Dashboard de Control</Title>
          <Text c="dimmed" size="lg">
            Bienvenido, {currentUser?.displayName}
          </Text>
        </div>
        
        <Group>
          <Tooltip label="Configuración">
            <ActionIcon variant="light" size="lg">
              <IconSettings size={20} />
            </ActionIcon>
          </Tooltip>
          
          <Tooltip label="Actualizar">
            <ActionIcon variant="light" size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Grid>
        {/* Panel de Control Principal */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* Acciones Rápidas */}
            <Card withBorder shadow="sm" p="lg">
              <Title order={3} mb="md">Acciones Rápidas</Title>
              <Grid>
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    leftSection={<IconPresentation size={20} />}
                    size="lg"
                    onClick={handleStartPresentation}
                  >
                    Iniciar Presentación
                  </Button>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    leftSection={<IconMaximize size={20} />}
                    variant="light"
                    size="lg"
                    onClick={handleOpenSpeakerDisplay}
                  >
                    Pantalla Orador
                  </Button>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    leftSection={<IconVideo size={20} />}
                    variant="outline"
                    size="lg"
                    onClick={handleManageMedia}
                  >
                    Gestionar Videos
                  </Button>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Button
                    fullWidth
                    leftSection={<IconPhoto size={20} />}
                    variant="outline"
                    size="lg"
                    onClick={handleManageMedia}
                  >
                    Gestionar Imágenes
                  </Button>
                </Grid.Col>
              </Grid>
            </Card>

            {/* Estado de la Reunión */}
            <Card withBorder shadow="sm" p="lg">
              <Title order={3} mb="md">Estado de la Reunión</Title>
              <Group justify="space-between">
                <div>
                  <Text size="lg" fw={500}>
                    {currentTemplate?.name || 'Sin plantilla seleccionada'}
                  </Text>
                  <Text c="dimmed">
                    Duración total: {currentTemplate?.totalDuration || 0} min
                  </Text>
                </div>
                
                <Group>
                  <IconUsers size={24} />
                  <Text size="sm" c="dimmed">
                    {timerState.isRunning ? 'En progreso' : 'Sin iniciar'}
                  </Text>
                </Group>
              </Group>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Panel de Información */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            {/* Información del Sistema */}
            <Card withBorder shadow="sm" p="lg">
              <Title order={4} mb="md">Sistema</Title>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Usuario:</Text>
                  <Text size="sm" fw={500}>{currentUser?.role}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm">Sesión:</Text>
                  <Text size="sm" c="green">Activa</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text size="sm">Cronómetro:</Text>
                  <Text size="sm" c={timerState.isRunning ? 'green' : 'gray'}>
                    {timerState.isRunning ? 'Ejecutándose' : 'Detenido'}
                  </Text>
                </Group>
              </Stack>
            </Card>

            {/* Próximas Funcionalidades */}
            <Card withBorder shadow="sm" p="lg">
              <Title order={4} mb="md">Próximas Funcionalidades</Title>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">• Biblioteca de medios</Text>
                <Text size="sm" c="dimmed">• Presentaciones automáticas</Text>
                <Text size="sm" c="dimmed">• Reportes de reuniones</Text>
                <Text size="sm" c="dimmed">• Configuración avanzada</Text>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}