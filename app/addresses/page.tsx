'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MapPin, Plus, Edit, Trash2, Check, Loader2 } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    is_default: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/user-login');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      label: 'Home',
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'United States',
      is_default: addresses.length === 0,
    });
    setShowDialog(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      full_name: address.full_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      country: address.country,
      is_default: address.is_default,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    setSaving(true);
    try {
      const supabase = getSupabaseClient(token);

      if (editingAddress) {
        const { error } = await supabase
          .from('user_addresses')
          .update(formData)
          .eq('id', editingAddress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert([formData]);

        if (error) throw error;
      }

      await fetchAddresses();
      setShowDialog(false);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Addresses</h1>
            <p className="text-slate-600">Manage your shipping addresses</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </div>

        {addresses.length === 0 ? (
          <Card className="p-12 text-center">
            <MapPin className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No addresses saved</h2>
            <p className="text-slate-600 mb-6">Add your first address to get started</p>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className={address.is_default ? 'border-2 border-green-500' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {address.label}
                        {address.is_default && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(address.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">{address.full_name}</p>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>{address.city}, {address.state} {address.zip_code}</p>
                    <p>{address.country}</p>
                    <p className="text-slate-600">Phone: {address.phone}</p>
                  </div>
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Home, Work, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line1">Address Line 1</Label>
              <Input
                id="address_line1"
                value={formData.address_line1}
                onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
              <Input
                id="address_line2"
                value={formData.address_line2}
                onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="is_default" className="cursor-pointer">Set as default address</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
