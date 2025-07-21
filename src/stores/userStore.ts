import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  UserSession, 
  UserRole, 
  UserPermission, 
  DEFAULT_PERMISSIONS, 
  DEFAULT_PREFERENCES 
} from '../types/user';

interface UserStore {
  // Estado de sesión
  session: UserSession;
  
  // Usuarios del sistema
  users: User[];
  
  // Actions de autenticación
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Actions de gestión de usuarios (solo admin)
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  
  // Actions de permisos
  updateUserPermissions: (userId: string, permissions: UserPermission[]) => void;
  hasPermission: (action: string) => boolean;
  
  // Actions de preferencias
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
  
  // Utilities
  getUserById: (userId: string) => User | undefined;
  getUsersByRole: (role: UserRole) => User[];
  isAdmin: () => boolean;
}

// Usuario administrador por defecto
const defaultAdmin: User = {
  id: 'admin-default',
  username: 'admin',
  displayName: 'Juan Pérez (Admin)',
  email: 'admin@presentation-app.local',
  role: 'admin',
  permissions: DEFAULT_PERMISSIONS.admin.map(action => ({
    action,
    granted: true,
    grantedAt: new Date()
  })),
  preferences: DEFAULT_PREFERENCES,
  isActive: true,
  createdAt: new Date(),
  lastLogin: new Date()
};

// Usuario operador por defecto
const defaultOperator: User = {
  id: 'operator-default',
  username: 'operador',
  displayName: 'María González (Operador)',
  role: 'operator',
  permissions: DEFAULT_PERMISSIONS.operator.map(action => ({
    action,
    granted: true,
    grantedBy: 'admin-default',
    grantedAt: new Date()
  })),
  preferences: DEFAULT_PREFERENCES,
  isActive: true,
  createdAt: new Date(),
  createdBy: 'admin-default'
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      session: {
        currentUser: null,
        isAuthenticated: false
      },
      
      users: [defaultAdmin, defaultOperator],
      
      // Autenticación
      login: async (username: string, password: string) => {
        // Simulación de autenticación (en producción sería con API/base de datos)
        const users = get().users;
        const user = users.find(u => 
          u.username.toLowerCase() === username.toLowerCase() && 
          u.isActive
        );
        
        if (user) {
          // En desarrollo, cualquier password funciona para facilitar testing
          // En producción aquí iría la verificación real de password
          const now = new Date();
          
          // Actualizar último login
          set(state => ({
            users: state.users.map(u => 
              u.id === user.id 
                ? { ...u, lastLogin: now }
                : u
            ),
            session: {
              currentUser: { ...user, lastLogin: now },
              isAuthenticated: true,
              sessionId: `session_${Date.now()}`,
              loginTime: now,
              lastActivity: now
            }
          }));
          
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({
          session: {
            currentUser: null,
            isAuthenticated: false
          }
        });
      },
      
      // Gestión de usuarios
      createUser: (userData) => {
        const currentUser = get().session.currentUser;
        if (!currentUser || !get().isAdmin()) {
          console.error('Solo los administradores pueden crear usuarios');
          return;
        }
        
        const newUser: User = {
          ...userData,
          id: `user_${Date.now()}`,
          createdAt: new Date(),
          createdBy: currentUser.id,
          permissions: userData.permissions.length > 0 
            ? userData.permissions 
            : DEFAULT_PERMISSIONS[userData.role].map(action => ({
                action,
                granted: true,
                grantedBy: currentUser.id,
                grantedAt: new Date()
              }))
        };
        
        set(state => ({
          users: [...state.users, newUser]
        }));
      },
      
      updateUser: (userId, updates) => {
        const currentUser = get().session.currentUser;
        if (!currentUser) return;
        
        // Solo admin puede editar otros usuarios, o el propio usuario puede editarse
        const canEdit = get().isAdmin() || currentUser.id === userId;
        if (!canEdit) {
          console.error('No tienes permisos para editar este usuario');
          return;
        }
        
        set(state => ({
          users: state.users.map(user => 
            user.id === userId 
              ? { ...user, ...updates }
              : user
          ),
          // Si es el usuario actual, actualizar también la sesión
          session: currentUser.id === userId
            ? { ...state.session, currentUser: { ...currentUser, ...updates } }
            : state.session
        }));
      },
      
      deleteUser: (userId) => {
        const currentUser = get().session.currentUser;
        if (!currentUser || !get().isAdmin()) {
          console.error('Solo los administradores pueden eliminar usuarios');
          return;
        }
        
        // No permitir eliminar el propio usuario admin
        if (userId === currentUser.id) {
          console.error('No puedes eliminar tu propio usuario');
          return;
        }
        
        set(state => ({
          users: state.users.filter(user => user.id !== userId)
        }));
      },
      
      // Permisos
      updateUserPermissions: (userId, permissions) => {
        const currentUser = get().session.currentUser;
        if (!currentUser || !get().isAdmin()) {
          console.error('Solo los administradores pueden modificar permisos');
          return;
        }
        
        set(state => ({
          users: state.users.map(user => 
            user.id === userId 
              ? { ...user, permissions }
              : user
          )
        }));
      },
      
      hasPermission: (action) => {
        const currentUser = get().session.currentUser;
        if (!currentUser) return false;
        
        return currentUser.permissions.some(p => 
          p.action === action && p.granted
        );
      },
      
      // Preferencias
      updatePreferences: (preferences) => {
        const currentUser = get().session.currentUser;
        if (!currentUser) return;
        
        const updatedPreferences = { ...currentUser.preferences, ...preferences };
        
        get().updateUser(currentUser.id, { preferences: updatedPreferences });
      },
      
      // Utilities
      getUserById: (userId) => {
        return get().users.find(user => user.id === userId);
      },
      
      getUsersByRole: (role) => {
        return get().users.filter(user => user.role === role && user.isActive);
      },
      
      isAdmin: () => {
        const currentUser = get().session.currentUser;
        return currentUser?.role === 'admin';
      }
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        users: state.users,
        // No persistir la sesión por seguridad
      })
    }
  )
);