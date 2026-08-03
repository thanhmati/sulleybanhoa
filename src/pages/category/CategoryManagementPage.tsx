import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, Flower, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/hooks/useCategories';

import {
  useFlowerTypesQuery,
  useCreateFlowerTypeMutation,
  useUpdateFlowerTypeMutation,
  useDeleteFlowerTypeMutation,
} from '@/hooks/useFlowerTypes';

import {
  useOccasionsQuery,
  useCreateOccasionMutation,
  useUpdateOccasionMutation,
  useDeleteOccasionMutation,
} from '@/hooks/useOccasions';

import { CategoryFormDialog } from './components/CategoryFormDialog';
import { FlowerTypeFormDialog } from './components/FlowerTypeFormDialog';
import { OccasionFormDialog } from './components/OccasionFormDialog';

import type { ICategory, IFlowerType, IOccasion } from '@/types/catalog-metadata';

export default function CategoryManagementPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'flowerTypes' | 'occasions'>(
    'categories',
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog States
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const [isFlowerTypeDialogOpen, setIsFlowerTypeDialogOpen] = useState(false);
  const [selectedFlowerType, setSelectedFlowerType] = useState<IFlowerType | null>(null);

  const [isOccasionDialogOpen, setIsOccasionDialogOpen] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<IOccasion | null>(null);

  // Delete Dialog States
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: 'category' | 'flowerType' | 'occasion';
  } | null>(null);

  // React Query Hooks
  const { data: categories = [], isLoading: loadingCat } = useCategoriesQuery();
  const createCat = useCreateCategoryMutation();
  const updateCat = useUpdateCategoryMutation();
  const deleteCat = useDeleteCategoryMutation();

  const { data: flowerTypes = [], isLoading: loadingFt } = useFlowerTypesQuery();
  const createFt = useCreateFlowerTypeMutation();
  const updateFt = useUpdateFlowerTypeMutation();
  const deleteFt = useDeleteFlowerTypeMutation();

  const { data: occasions = [], isLoading: loadingOcc } = useOccasionsQuery();
  const createOcc = useCreateOccasionMutation();
  const updateOcc = useUpdateOccasionMutation();
  const deleteOcc = useDeleteOccasionMutation();

  // Handlers for Category
  const handleSaveCategory = async (payload: any) => {
    if (selectedCategory) {
      await updateCat.mutateAsync({ id: selectedCategory.id, payload });
    } else {
      await createCat.mutateAsync(payload);
    }
    setIsCategoryDialogOpen(false);
    setSelectedCategory(null);
  };

  // Handlers for FlowerType
  const handleSaveFlowerType = async (payload: any) => {
    if (selectedFlowerType) {
      await updateFt.mutateAsync({ id: selectedFlowerType.id, payload });
    } else {
      await createFt.mutateAsync(payload);
    }
    setIsFlowerTypeDialogOpen(false);
    setSelectedFlowerType(null);
  };

  // Handlers for Occasion
  const handleSaveOccasion = async (payload: any) => {
    if (selectedOccasion) {
      await updateOcc.mutateAsync({ id: selectedOccasion.id, payload });
    } else {
      await createOcc.mutateAsync(payload);
    }
    setIsOccasionDialogOpen(false);
    setSelectedOccasion(null);
  };

  // Delete Action Confirm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') {
      await deleteCat.mutateAsync(deleteTarget.id);
    } else if (deleteTarget.type === 'flowerType') {
      await deleteFt.mutateAsync(deleteTarget.id);
    } else if (deleteTarget.type === 'occasion') {
      await deleteOcc.mutateAsync(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  // Filtered lists
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.key && c.key.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const filteredFlowerTypes = flowerTypes.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const filteredOccasions = occasions.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.description && o.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
            Quản Lý Phân Loại Sản Phẩm
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý danh mục thiết kế, danh sách loại hoa và các dịp tặng trong hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs Control & Search */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-3 rounded-xl border">
          <TabsList className="bg-muted p-1 rounded-lg">
            <TabsTrigger value="categories" className="gap-2">
              <Layers size={16} />
              Danh mục ({categories.length})
            </TabsTrigger>
            <TabsTrigger value="flowerTypes" className="gap-2">
              <Flower size={16} />
              Loại hoa ({flowerTypes.length})
            </TabsTrigger>
            <TabsTrigger value="occasions" className="gap-2">
              <Calendar size={16} />
              Dịp tặng ({occasions.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                placeholder="Tìm kiếm phân loại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {activeTab === 'categories' && (
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsCategoryDialogOpen(true);
                }}
                className="gap-2 shrink-0"
              >
                <Plus size={16} /> Thêm Danh Mục
              </Button>
            )}

            {activeTab === 'flowerTypes' && (
              <Button
                onClick={() => {
                  setSelectedFlowerType(null);
                  setIsFlowerTypeDialogOpen(true);
                }}
                className="gap-2 shrink-0"
              >
                <Plus size={16} /> Thêm Loại Hoa
              </Button>
            )}

            {activeTab === 'occasions' && (
              <Button
                onClick={() => {
                  setSelectedOccasion(null);
                  setIsOccasionDialogOpen(true);
                }}
                className="gap-2 shrink-0"
              >
                <Plus size={16} /> Thêm Dịp Tặng
              </Button>
            )}
          </div>
        </div>

        {/* Tab 1: Categories */}
        <TabsContent value="categories" className="m-0">
          <div className="bg-card rounded-xl border overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">STT</TableHead>
                  <TableHead className="w-[180px]">Mã Key</TableHead>
                  <TableHead className="w-[220px]">Tên Danh Mục</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead className="w-[120px] text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingCat ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Đang tải dữ liệu danh mục...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy danh mục nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-muted font-semibold text-primary">
                          {item.key}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.description || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCategory(item);
                              setIsCategoryDialogOpen(true);
                            }}
                          >
                            <Edit2 size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setDeleteTarget({
                                id: item.id,
                                name: item.name,
                                type: 'category',
                              })
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 2: Flower Types */}
        <TabsContent value="flowerTypes" className="m-0">
          <div className="bg-card rounded-xl border overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">STT</TableHead>
                  <TableHead className="w-[260px]">Tên Loại Hoa</TableHead>
                  <TableHead>Mô Tả Đặc Tính</TableHead>
                  <TableHead className="w-[120px] text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingFt ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Đang tải danh sách loại hoa...
                    </TableCell>
                  </TableRow>
                ) : filteredFlowerTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy loại hoa nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFlowerTypes.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/60 text-xs font-semibold">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.description || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedFlowerType(item);
                              setIsFlowerTypeDialogOpen(true);
                            }}
                          >
                            <Edit2 size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setDeleteTarget({
                                id: item.id,
                                name: item.name,
                                type: 'flowerType',
                              })
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tab 3: Occasions */}
        <TabsContent value="occasions" className="m-0">
          <div className="bg-card rounded-xl border overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">STT</TableHead>
                  <TableHead className="w-[260px]">Tên Dịp Tặng</TableHead>
                  <TableHead>Mô Tả Dịp Tặng</TableHead>
                  <TableHead className="w-[120px] text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingOcc ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Đang tải danh sách dịp tặng...
                    </TableCell>
                  </TableRow>
                ) : filteredOccasions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy dịp tặng nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOccasions.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/30 text-xs font-semibold">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.description || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedOccasion(item);
                              setIsOccasionDialogOpen(true);
                            }}
                          >
                            <Edit2 size={15} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setDeleteTarget({
                                id: item.id,
                                name: item.name,
                                type: 'occasion',
                              })
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Form Dialog */}
      <CategoryFormDialog
        category={selectedCategory}
        isOpen={isCategoryDialogOpen}
        onClose={() => {
          setIsCategoryDialogOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSaveCategory}
        isLoading={createCat.isPending || updateCat.isPending}
      />

      {/* FlowerType Form Dialog */}
      <FlowerTypeFormDialog
        flowerType={selectedFlowerType}
        isOpen={isFlowerTypeDialogOpen}
        onClose={() => {
          setIsFlowerTypeDialogOpen(false);
          setSelectedFlowerType(null);
        }}
        onSubmit={handleSaveFlowerType}
        isLoading={createFt.isPending || updateFt.isPending}
      />

      {/* Occasion Form Dialog */}
      <OccasionFormDialog
        occasion={selectedOccasion}
        isOpen={isOccasionDialogOpen}
        onClose={() => {
          setIsOccasionDialogOpen(false);
          setSelectedOccasion(null);
        }}
        onSubmit={handleSaveOccasion}
        isLoading={createOcc.isPending || updateOcc.isPending}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa{' '}
              <strong className="text-foreground">{deleteTarget?.name}</strong>? Thao tác này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xác Nhận Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
