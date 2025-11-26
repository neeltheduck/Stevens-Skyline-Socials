export const CATEGORY_CLASSES: Record<string, string> = {
  Academic: 'bg-red-100 text-red-800',
  Social: 'bg-yellow-100 text-yellow-800',
  Sports: 'bg-green-100 text-green-800',
  Career: 'bg-purple-100 text-purple-800',
  Technology: 'bg-blue-100 text-blue-800',
  Arts: 'bg-amber-100 text-amber-800',
};

export function getCategoryClasses(category?: string) {
  if (!category) return 'bg-gray-100 text-gray-700';
  return CATEGORY_CLASSES[category] || 'bg-gray-100 text-gray-700';
}
