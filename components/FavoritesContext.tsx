import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { PackageType } from '../App'; // import your type from App.tsx

type FavoritesContextType = {
  favorites: PackageType[];
  addFavorite: (pkg: PackageType) => void;
  removeFavorite: (id: string, isLocal?: boolean) => void;
   isFavorite: (id: string, isLocal?: boolean) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<PackageType[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchFavorites(user.uid);
      } else {
        setUserId(null);
        setFavorites((prev) => prev.filter(p => p.isLocal));
      }
    });
    return unsubscribe;
  }, []);

  const fetchFavorites = async (uid: string) => {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`id, package_info:package_id(*), local_package_info:local_package_id(*)`)
      .eq('user_id', uid);

    if (error) {
      console.error('Error fetching favorites:', error);
      return;
    }

    const mapped = data
    .map((d: any) => {
        const isLocal = !!d.local_package_info;
        const pkg = isLocal ? d.local_package_info : d.package_info;
        if (!pkg) return null;

        return {
        id: pkg.id,
        image: pkg.main_photo || '',
        name: pkg.name || 'Unknown Package',
        airline: pkg.name || 'Unknown Package', // always set airline
        destination: pkg.destination || 'Unknown Destination',
        location: pkg.location || '',
        price: pkg.price || 0,
        description: pkg.description || '',
        isLocal,
        };
    })
    .filter(Boolean);

    setFavorites(mapped as PackageType[]);
  };

    const addFavorite = async (pkg: PackageType) => {
    if (!userId) return;

    // Optimistic update
    setFavorites(prev => [...prev, pkg]);

    const insertData = {
        user_id: userId,
        package_id: pkg.isLocal ? null : pkg.id,
        local_package_id: pkg.isLocal ? pkg.id : null,
    };

    const { error } = await supabase.from('user_favorites').insert(insertData);
    if (error) {
        console.error('Error adding favorite:', error.message);
        // optional rollback
        setFavorites(prev => prev.filter(p => p.id !== pkg.id));
    }
    };

    const removeFavorite = async (pkgId: string, isLocal?: boolean) => {
    if (!userId) return;

    // Optimistic update
    setFavorites(prev =>
        prev.filter(p => !(p.id === pkgId && p.isLocal === isLocal))
    );

    const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq(isLocal ? 'local_package_id' : 'package_id', pkgId);

    if (error) {
        console.error('Error removing favorite:', error);
        // optional rollback
        fetchFavorites(userId); // or manually revert
    }
    };

    const isFavorite = (id: string, isLocal?: boolean) =>
    favorites.some((p) => p.id === id && (isLocal === undefined || p.isLocal === isLocal));

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
