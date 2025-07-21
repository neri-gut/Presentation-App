import { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Group,
  Alert,
  Stack,
  Select,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUser, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useUserStore } from '../../stores/userStore';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, users } = useUserStore();
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (!value ? 'El usuario es requerido' : null),
      password: (value) => (!value ? 'La contraseña es requerida' : null),
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (username: string) => {
    form.setValues({ username, password: 'demo123' });
    handleSubmit({ username, password: 'demo123' });
  };

  const activeUsers = users.filter(u => u.isActive);

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Multimedia Presentation App
      </Title>
      
      <Text c="dimmed" size="sm" ta="center" mb="xl">
        Inicia sesión para acceder al sistema de presentaciones
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Usuario"
              placeholder="Ingresa tu usuario"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('username')}
            />

            <PasswordInput
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('password')}
            />

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {error}
              </Alert>
            )}

            <Button 
              type="submit" 
              fullWidth 
              loading={isLoading}
              mt="md"
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </form>

        {/* Acceso rápido para desarrollo */}
        <Box mt="xl">
          <Text size="sm" c="dimmed" ta="center" mb="md">
            Acceso rápido (desarrollo):
          </Text>
          
          <Stack gap="xs">
            {activeUsers.map((user) => (
              <Button
                key={user.id}
                variant="light"
                size="sm"
                fullWidth
                onClick={() => handleQuickLogin(user.username)}
                disabled={isLoading}
              >
                {user.displayName} ({user.role})
              </Button>
            ))}
          </Stack>
        </Box>

        <Text c="dimmed" size="xs" ta="center" mt="xl">
          En modo desarrollo, cualquier contraseña es válida
        </Text>
      </Paper>
    </Container>
  );
}