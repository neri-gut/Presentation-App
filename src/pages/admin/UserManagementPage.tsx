import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Table,
  Badge,
  Group,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  Switch,
  Stack,
  Paper,
  Alert,
  Tooltip,
  MultiSelect,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconSettings,
  IconUser,
  IconMail,
  IconShieldCheck,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useUserStore } from '../../stores/userStore';
import { User, UserRole, DEFAULT_PERMISSIONS, PermissionAction } from '../../types/user';

interface UserFormData {
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  permissions: PermissionAction[];
}

export default function UserManagementPage() {
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    session,
    createUser,
    updateUser,
    deleteUser,
    updateUserPermissions,
    isAdmin
  } = useUserStore();

  const currentUser = session.currentUser;

  const createForm = useForm<UserFormData>({
    initialValues: {
      username: '',
      displayName: '',
      email: '',
      role: 'viewer',
      isActive: true,
      permissions: [],
    },
    validate: {
      username: (value) => (!value ? 'El usuario es requerido' : null),
      displayName: (value) => (!value ? 'El nombre es requerido' : null),
      email: (value) => (!value || /.+@.+\..+/.test(value) ? null : 'Email inválido'),
    },
  });

  const editForm = useForm<UserFormData>({
    initialValues: {
      username: '',
      displayName: '',
      email: '',
      role: 'viewer',
      isActive: true,
      permissions: [],
    },
  });

  // Verificar permisos de administrador
  if (!currentUser || !isAdmin()) {
    return (
      <Container size="md" mt="xl">
        <Alert icon={<IconAlertTriangle size={16} />} color="red">
          No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
        </Alert>
      </Container>
    );
  }

  const handleCreateUser = (values: UserFormData) => {
    const permissions = values.permissions.length > 0 
      ? values.permissions.map(action => ({
          action,
          granted: true,
          grantedBy: currentUser.id,
          grantedAt: new Date()
        }))
      : DEFAULT_PERMISSIONS[values.role].map(action => ({
          action,
          granted: true,
          grantedBy: currentUser.id,
          grantedAt: new Date()
        }));

    createUser({
      ...values,
      preferences: {
        ...useUserStore.getState().users[0].preferences, // Usar preferencias por defecto
      },
      permissions
    });

    createForm.reset();
    closeCreate();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.setValues({
      username: user.username,
      displayName: user.displayName,
      email: user.email || '',
      role: user.role,
      isActive: user.isActive,
      permissions: user.permissions.filter(p => p.granted).map(p => p.action),
    });
    openEdit();
  };

  const handleUpdateUser = (values: UserFormData) => {
    if (!selectedUser) return;

    const permissions = values.permissions.map(action => ({
      action,
      granted: true,
      grantedBy: currentUser.id,
      grantedAt: new Date()
    }));

    updateUser(selectedUser.id, {
      username: values.username,
      displayName: values.displayName,
      email: values.email,
      role: values.role,
      isActive: values.isActive,
    });

    updateUserPermissions(selectedUser.id, permissions);

    editForm.reset();
    closeEdit();
    setSelectedUser(null);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    openDelete();
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      closeDelete();
      setSelectedUser(null);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      admin: 'red',
      operator: 'blue',
      audio: 'green',
      video: 'orange',
      elder: 'purple',
      attendant: 'cyan',
      viewer: 'gray'
    };
    return colors[role];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      admin: 'Administrador',
      operator: 'Operador',
      audio: 'Audio',
      video: 'Video',
      elder: 'Anciano',
      attendant: 'Siervo',
      viewer: 'Visualizador'
    };
    return labels[role];
  };

  const allPermissions = Object.values(DEFAULT_PERMISSIONS).flat();
  const uniquePermissions = [...new Set(allPermissions)];

  const permissionLabels: Record<PermissionAction, string> = {
    user_management: 'Gestión de usuarios',
    system_settings: 'Configuración del sistema',
    backup_restore: 'Respaldos y restauración',
    timer_control: 'Control del cronómetro',
    meeting_config: 'Configuración de reuniones',
    template_edit: 'Editar plantillas',
    timer_override: 'Anular cronómetro',
    display_control: 'Control de pantallas',
    media_management: 'Gestión multimedia',
    presentation_control: 'Control de presentaciones',
    reports_view: 'Ver reportes',
    reports_export: 'Exportar reportes',
    data_edit: 'Editar datos',
    profile_edit: 'Editar perfil',
    preferences_edit: 'Editar preferencias'
  };

  return (
    <Container size="xl" mt="md">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestión de Usuarios</Title>
          <Text c="dimmed" size="sm">
            Administra usuarios, roles y permisos del sistema
          </Text>
        </div>
        
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreate}
        >
          Crear Usuario
        </Button>
      </Group>

      <Paper withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Usuario</Table.Th>
              <Table.Th>Rol</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Último acceso</Table.Th>
              <Table.Th>Acciones</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="sm">
                    <IconUser size={16} />
                    <div>
                      <Text fw={500}>{user.displayName}</Text>
                      <Text size="xs" c="dimmed">@{user.username}</Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={getRoleBadgeColor(user.role)} variant="light">
                    {getRoleLabel(user.role)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={user.isActive ? 'green' : 'red'} variant="light">
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString('es-ES')
                      : 'Nunca'
                    }
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="Editar usuario">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleEditUser(user)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    
                    {user.id !== currentUser.id && (
                      <Tooltip label="Eliminar usuario">
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Modal crear usuario */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title="Crear Nuevo Usuario"
        size="md"
      >
        <form onSubmit={createForm.onSubmit(handleCreateUser)}>
          <Stack>
            <TextInput
              label="Usuario"
              placeholder="nombre_usuario"
              leftSection={<IconUser size={16} />}
              {...createForm.getInputProps('username')}
            />

            <TextInput
              label="Nombre Completo"
              placeholder="Nombre a mostrar"
              {...createForm.getInputProps('displayName')}
            />

            <TextInput
              label="Email"
              placeholder="usuario@dominio.com"
              leftSection={<IconMail size={16} />}
              {...createForm.getInputProps('email')}
            />

            <Select
              label="Rol"
              placeholder="Selecciona un rol"
              data={[
                { value: 'viewer', label: 'Visualizador' },
                { value: 'attendant', label: 'Siervo Ministerial' },
                { value: 'audio', label: 'Técnico Audio' },
                { value: 'video', label: 'Técnico Video' },
                { value: 'elder', label: 'Anciano' },
                { value: 'operator', label: 'Operador Principal' },
                { value: 'admin', label: 'Administrador' },
              ]}
              {...createForm.getInputProps('role')}
            />

            <MultiSelect
              label="Permisos Personalizados (opcional)"
              placeholder="Deja vacío para usar permisos por defecto del rol"
              data={uniquePermissions.map(p => ({
                value: p,
                label: permissionLabels[p] || p
              }))}
              {...createForm.getInputProps('permissions')}
            />

            <Switch
              label="Usuario activo"
              {...createForm.getInputProps('isActive', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeCreate}>
                Cancelar
              </Button>
              <Button type="submit">
                Crear Usuario
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal editar usuario */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Editar Usuario"
        size="md"
      >
        <form onSubmit={editForm.onSubmit(handleUpdateUser)}>
          <Stack>
            <TextInput
              label="Usuario"
              placeholder="nombre_usuario"
              leftSection={<IconUser size={16} />}
              {...editForm.getInputProps('username')}
            />

            <TextInput
              label="Nombre Completo"
              placeholder="Nombre a mostrar"
              {...editForm.getInputProps('displayName')}
            />

            <TextInput
              label="Email"
              placeholder="usuario@dominio.com"
              leftSection={<IconMail size={16} />}
              {...editForm.getInputProps('email')}
            />

            <Select
              label="Rol"
              placeholder="Selecciona un rol"
              data={[
                { value: 'viewer', label: 'Visualizador' },
                { value: 'attendant', label: 'Siervo Ministerial' },
                { value: 'audio', label: 'Técnico Audio' },
                { value: 'video', label: 'Técnico Video' },
                { value: 'elder', label: 'Anciano' },
                { value: 'operator', label: 'Operador Principal' },
                { value: 'admin', label: 'Administrador' },
              ]}
              {...editForm.getInputProps('role')}
            />

            <MultiSelect
              label="Permisos"
              data={uniquePermissions.map(p => ({
                value: p,
                label: permissionLabels[p] || p
              }))}
              {...editForm.getInputProps('permissions')}
            />

            <Switch
              label="Usuario activo"
              {...editForm.getInputProps('isActive', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeEdit}>
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Modal eliminar usuario */}
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Eliminar Usuario"
        size="sm"
      >
        <Stack>
          <Alert icon={<IconAlertTriangle size={16} />} color="red">
            ¿Estás seguro de que quieres eliminar el usuario <strong>{selectedUser?.displayName}</strong>?
            Esta acción no se puede deshacer.
          </Alert>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeDelete}>
              Cancelar
            </Button>
            <Button color="red" onClick={confirmDeleteUser}>
              Eliminar Usuario
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}