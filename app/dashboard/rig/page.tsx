'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Caravan, Plus, Trash2, Loader2 } from 'lucide-react'
import type { RigProfile } from '@/lib/types'

const rigTypes = [
  { value: 'motorhome', label: 'Motorhome' },
  { value: 'caravan', label: 'Caravan' },
  { value: 'camper_trailer', label: 'Camper Trailer' },
  { value: 'fifth_wheel', label: 'Fifth Wheel' },
  { value: 'tent', label: 'Tent' },
  { value: 'other', label: 'Other' },
]

const powerRequirements = [
  { value: '15amp', label: '15 Amp' },
  { value: '10amp', label: '10 Amp' },
  { value: 'none', label: 'No Power Required' },
]

export default function RigProfilePage() {
  const [rigs, setRigs] = useState<RigProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingRig, setEditingRig] = useState<RigProfile | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    rig_type: 'caravan' as RigProfile['rig_type'],
    make: '',
    model: '',
    year: '',
    length_meters: '',
    width_meters: '',
    height_meters: '',
    weight_kg: '',
    has_slide_outs: false,
    slide_out_length: '',
    power_requirement: '15amp' as RigProfile['power_requirement'],
    is_default: false,
  })

  useEffect(() => {
    fetchRigs()
  }, [])

  async function fetchRigs() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('rig_profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setRigs(data || [])
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name: '',
      rig_type: 'caravan',
      make: '',
      model: '',
      year: '',
      length_meters: '',
      width_meters: '',
      height_meters: '',
      weight_kg: '',
      has_slide_outs: false,
      slide_out_length: '',
      power_requirement: '15amp',
      is_default: false,
    })
    setEditingRig(null)
    setShowForm(false)
  }

  function editRig(rig: RigProfile) {
    setFormData({
      name: rig.name,
      rig_type: rig.rig_type,
      make: rig.make || '',
      model: rig.model || '',
      year: rig.year?.toString() || '',
      length_meters: rig.length_meters?.toString() || '',
      width_meters: rig.width_meters?.toString() || '',
      height_meters: rig.height_meters?.toString() || '',
      weight_kg: rig.weight_kg?.toString() || '',
      has_slide_outs: rig.has_slide_outs,
      slide_out_length: rig.slide_out_length?.toString() || '',
      power_requirement: rig.power_requirement,
      is_default: rig.is_default,
    })
    setEditingRig(rig)
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Please sign in to save your rig profile')
      setSaving(false)
      return
    }

    const rigData = {
      user_id: user.id,
      name: formData.name,
      rig_type: formData.rig_type,
      make: formData.make || null,
      model: formData.model || null,
      year: formData.year ? parseInt(formData.year) : null,
      length_meters: formData.length_meters ? parseFloat(formData.length_meters) : null,
      width_meters: formData.width_meters ? parseFloat(formData.width_meters) : null,
      height_meters: formData.height_meters ? parseFloat(formData.height_meters) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      has_slide_outs: formData.has_slide_outs,
      slide_out_length: formData.slide_out_length ? parseFloat(formData.slide_out_length) : null,
      power_requirement: formData.power_requirement,
      is_default: formData.is_default,
    }

    if (editingRig) {
      const { error } = await supabase
        .from('rig_profiles')
        .update(rigData)
        .eq('id', editingRig.id)

      if (error) {
        toast.error('Failed to update rig profile')
        setSaving(false)
        return
      }
      toast.success('Rig profile updated')
    } else {
      const { error } = await supabase
        .from('rig_profiles')
        .insert(rigData)

      if (error) {
        toast.error('Failed to save rig profile')
        setSaving(false)
        return
      }
      toast.success('Rig profile saved')
    }

    await fetchRigs()
    resetForm()
    setSaving(false)
  }

  async function deleteRig(id: string) {
    const { error } = await supabase
      .from('rig_profiles')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete rig profile')
      return
    }

    toast.success('Rig profile deleted')
    fetchRigs()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium text-foreground">My Rig</h1>
          <p className="text-muted-foreground mt-1">
            Save your caravan or RV details for easier booking
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rig
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRig ? 'Edit Rig Profile' : 'Add New Rig'}</CardTitle>
            <CardDescription>
              Enter your caravan or RV details to help parks understand your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Rig Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Our Family Caravan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rig_type">Type *</Label>
                  <Select
                    value={formData.rig_type}
                    onValueChange={(value) => setFormData({ ...formData, rig_type: value as RigProfile['rig_type'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rigTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Jayco"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Journey"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="e.g., 2022"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (m)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 6.5"
                    value={formData.length_meters}
                    onChange={(e) => setFormData({ ...formData, length_meters: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (m)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={formData.width_meters}
                    onChange={(e) => setFormData({ ...formData, width_meters: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (m)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 3.0"
                    value={formData.height_meters}
                    onChange={(e) => setFormData({ ...formData, height_meters: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 2500"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="power">Power Requirement</Label>
                <Select
                  value={formData.power_requirement}
                  onValueChange={(value) => setFormData({ ...formData, power_requirement: value as RigProfile['power_requirement'] })}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {powerRequirements.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="slide_outs"
                  checked={formData.has_slide_outs}
                  onCheckedChange={(checked) => setFormData({ ...formData, has_slide_outs: checked as boolean })}
                />
                <Label htmlFor="slide_outs">Has slide-outs</Label>
              </div>

              {formData.has_slide_outs && (
                <div className="space-y-2">
                  <Label htmlFor="slide_out_length">Slide-out Extension (m)</Label>
                  <Input
                    id="slide_out_length"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 0.8"
                    value={formData.slide_out_length}
                    onChange={(e) => setFormData({ ...formData, slide_out_length: e.target.value })}
                    className="w-full sm:w-[200px]"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                />
                <Label htmlFor="is_default">Set as default rig</Label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingRig ? 'Update Rig' : 'Save Rig'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {rigs.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {rigs.map((rig) => (
            <Card key={rig.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Caravan className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{rig.name}</h3>
                        {rig.is_default && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rigTypes.find(t => t.value === rig.rig_type)?.label}
                        {rig.make && ` - ${rig.make}`}
                        {rig.model && ` ${rig.model}`}
                        {rig.year && ` (${rig.year})`}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                        {rig.length_meters && <span>{rig.length_meters}m long</span>}
                        {rig.power_requirement && (
                          <span>{powerRequirements.find(p => p.value === rig.power_requirement)?.label}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => editRig(rig)}>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => deleteRig(rig.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Caravan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No rigs saved yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add your caravan or RV details to make booking faster and help parks prepare for your arrival.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Rig
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
