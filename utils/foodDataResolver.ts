import { Platform } from 'react-native';

// Types for the FoodDataResolver module
export interface FoodData {
  product_name: string;
  brand: string;
  ingredients: string[];
  nutrition_facts: {
    total_carbs_g: number;
    fiber_g: number;
    sugars_g: number;
    protein_g?: number;
    fat_g?: number;
    calories?: number;
  };
  serving_size_g: number;
  glycemic_index?: number;
}

export interface ResolverResult {
  success: boolean;
  foodData?: FoodData;
  source?: string;
  trust_score?: number;
  incomplete_flag?: boolean;
  error?: string;
}

interface APISource {
  name: string;
  access: string;
  url: string;
  doc: string;
  notes: string;
  resolver: (barcode: string) => Promise<ResolverResult>;
}

// Cache for frequent lookups
const foodCache = new Map<string, { data: ResolverResult; timestamp: number }>();
const CACHE_VALIDITY_DAYS = 30;
const CACHE_VALIDITY_MS = CACHE_VALIDITY_DAYS * 24 * 60 * 60 * 1000;

// Quality scoring function
const calculateTrustScore = (data: Partial<FoodData>, source: string): number => {
  let score = 0.5; // Base score
  
  // Source reliability weights
  const sourceWeights: Record<string, number> = {
    'USDA FoodData Central': 0.95,
    'Open Food Facts API': 0.85,
    'Edamam Food Database': 0.90,
    'FatSecret Platform': 0.80,
    'Go-UPC API': 0.70,
    'Barcode Lookup API': 0.65,
    'Mock Database': 0.60
  };
  
  score = sourceWeights[source] || 0.5;
  
  // Completeness bonus
  if (data.product_name) score += 0.05;
  if (data.brand) score += 0.05;
  if (data.ingredients && data.ingredients.length > 0) score += 0.10;
  if (data.nutrition_facts) {
    if (data.nutrition_facts.total_carbs_g !== undefined) score += 0.05;
    if (data.nutrition_facts.fiber_g !== undefined) score += 0.05;
    if (data.nutrition_facts.sugars_g !== undefined) score += 0.05;
  }
  if (data.serving_size_g) score += 0.05;
  
  return Math.min(score, 1.0);
};

// Check if data is incomplete
const isIncomplete = (data: Partial<FoodData>): boolean => {
  const required = [
    data.product_name,
    data.brand,
    data.ingredients,
    data.nutrition_facts,
    data.serving_size_g
  ];
  
  return required.some(field => !field);
};

// Parse ingredients string into array
const parseIngredients = (ingredientsStr: string): string[] => {
  if (!ingredientsStr) return [];
  
  return ingredientsStr
    .split(/[,;]|\band\b/i)
    .map(ingredient => ingredient.trim())
    .filter(ingredient => ingredient.length > 0)
    .map(ingredient => ingredient.replace(/^[\(\[]|[\)\]]$/g, '').trim());
};

// API Resolvers
const openFoodFactsResolver = async (barcode: string): Promise<ResolverResult> => {
  try {
    console.log(`[OpenFoodFacts] Looking up barcode: ${barcode}`);
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 0 || !data.product) {
      return { success: false, error: 'Product not found in Open Food Facts' };
    }
    
    const product = data.product;
    const nutriments = product.nutriments || {};
    
    const foodData: FoodData = {
      product_name: product.product_name || product.product_name_en || 'Unknown Product',
      brand: product.brands || 'Unknown Brand',
      ingredients: parseIngredients(product.ingredients_text || product.ingredients_text_en || ''),
      nutrition_facts: {
        total_carbs_g: nutriments.carbohydrates_100g || nutriments.carbohydrates || 0,
        fiber_g: nutriments.fiber_100g || nutriments.fiber || 0,
        sugars_g: nutriments.sugars_100g || nutriments.sugars || 0,
        protein_g: nutriments.proteins_100g || nutriments.proteins,
        fat_g: nutriments.fat_100g || nutriments.fat,
        calories: nutriments['energy-kcal_100g'] || nutriments['energy-kcal']
      },
      serving_size_g: parseFloat(product.serving_size) || 100
    };
    
    const trust_score = calculateTrustScore(foodData, 'Open Food Facts API');
    const incomplete_flag = isIncomplete(foodData);
    
    console.log(`[OpenFoodFacts] Found: ${foodData.product_name} (trust: ${trust_score})`);
    
    return {
      success: true,
      foodData,
      source: 'Open Food Facts API',
      trust_score,
      incomplete_flag
    };
  } catch (error) {
    console.error('[OpenFoodFacts] Error:', error);
    return { success: false, error: `Open Food Facts API error: ${error}` };
  }
};

const usdaFoodDataResolver = async (barcode: string): Promise<ResolverResult> => {
  try {
    console.log(`[USDA] Looking up barcode: ${barcode}`);
    // Note: USDA FoodData Central doesn't have direct barcode lookup
    // This would require an API key and keyword-based search
    // For now, we'll return a not found result
    return { success: false, error: 'USDA FoodData Central requires keyword search, not barcode lookup' };
  } catch (error) {
    console.error('[USDA] Error:', error);
    return { success: false, error: `USDA API error: ${error}` };
  }
};

const edamamResolver = async (barcode: string): Promise<ResolverResult> => {
  try {
    console.log(`[Edamam] Looking up barcode: ${barcode}`);
    // Note: Edamam requires API credentials
    // This is a placeholder implementation
    return { success: false, error: 'Edamam API requires authentication credentials' };
  } catch (error) {
    console.error('[Edamam] Error:', error);
    return { success: false, error: `Edamam API error: ${error}` };
  }
};

const fatSecretResolver = async (barcode: string): Promise<ResolverResult> => {
  try {
    console.log(`[FatSecret] Looking up barcode: ${barcode}`);
    // Note: FatSecret requires OAuth authentication
    // This is a placeholder implementation
    return { success: false, error: 'FatSecret API requires OAuth authentication' };
  } catch (error) {
    console.error('[FatSecret] Error:', error);
    return { success: false, error: `FatSecret API error: ${error}` };
  }
};

const goUpcResolver = async (barcode: string): Promise<ResolverResult> => {
  try {
    console.log(`[Go-UPC] Looking up barcode: ${barcode}`);
    // Note: Go-UPC requires API key
    // This is a placeholder implementation
    return { success: false, error: 'Go-UPC API requires API key' };
  } catch (error) {
    console.error('[Go-UPC] Error:', error);
    return { success: false, error: `Go-UPC API error: ${error}` };
  }
};

const barcodeLookupResolver = async (barcode: string): Promise<ResolverResult> => {
  try {
    console.log(`[BarcodeLookup] Looking up barcode: ${barcode}`);
    // Note: Barcode Lookup requires API key
    // This is a placeholder implementation
    return { success: false, error: 'Barcode Lookup API requires API key' };
  } catch (error) {
    console.error('[BarcodeLookup] Error:', error);
    return { success: false, error: `Barcode Lookup API error: ${error}` };
  }
};

// Mock database fallback for demo purposes
const mockDatabaseResolver = async (barcode: string): Promise<ResolverResult> => {
  console.log(`[MockDB] Looking up barcode: ${barcode}`);
  
  // Enhanced mock database with more realistic data
  const mockDatabase: Record<string, Partial<FoodData>> = {
    '049000006346': {
      product_name: 'Coca-Cola Classic',
      brand: 'Coca-Cola',
      ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
      nutrition_facts: {
        total_carbs_g: 39,
        fiber_g: 0,
        sugars_g: 39,
        protein_g: 0,
        fat_g: 0,
        calories: 140
      },
      serving_size_g: 355
    },
    '038000138416': {
      product_name: 'Lays Classic Potato Chips',
      brand: 'Lays',
      ingredients: ['Potatoes', 'Vegetable Oil', 'Salt'],
      nutrition_facts: {
        total_carbs_g: 15,
        fiber_g: 1,
        sugars_g: 0,
        protein_g: 2,
        fat_g: 10,
        calories: 160
      },
      serving_size_g: 28
    },
    '021130126026': {
      product_name: 'Honey Nut Cheerios',
      brand: 'General Mills',
      ingredients: ['Whole Grain Oats', 'Sugar', 'Oat Bran', 'Corn Starch', 'Honey', 'Brown Sugar Syrup', 'Salt'],
      nutrition_facts: {
        total_carbs_g: 22,
        fiber_g: 3,
        sugars_g: 9,
        protein_g: 3,
        fat_g: 2,
        calories: 110
      },
      serving_size_g: 28
    },
    '123456789012': {
      product_name: 'Granola Bar',
      brand: 'Nature Valley',
      ingredients: ['Whole Grain Oats', 'Sugar', 'Canola Oil', 'Rice Flour', 'Honey', 'Brown Sugar Syrup'],
      nutrition_facts: {
        total_carbs_g: 29,
        fiber_g: 4,
        sugars_g: 11,
        protein_g: 4,
        fat_g: 6,
        calories: 190
      },
      serving_size_g: 42
    }
  };
  
  const mockData = mockDatabase[barcode];
  
  if (mockData) {
    const foodData = mockData as FoodData;
    const trust_score = calculateTrustScore(foodData, 'Mock Database');
    const incomplete_flag = isIncomplete(foodData);
    
    console.log(`[MockDB] Found: ${foodData.product_name} (trust: ${trust_score})`);
    
    return {
      success: true,
      foodData,
      source: 'Mock Database',
      trust_score,
      incomplete_flag
    };
  }
  
  // Generate a random product for unknown barcodes (demo purposes)
  const productNames = ['Mystery Snack', 'Unknown Beverage', 'Test Food Item', 'Sample Product'];
  const brands = ['Generic', 'Test Brand', 'Demo Co.', 'Sample Inc.'];
  const sugarLevels = [5, 12, 18, 25, 32];
  
  const randomName = productNames[Math.floor(Math.random() * productNames.length)];
  const randomBrand = brands[Math.floor(Math.random() * brands.length)];
  const randomSugar = sugarLevels[Math.floor(Math.random() * sugarLevels.length)];
  
  const generatedData: FoodData = {
    product_name: randomName,
    brand: randomBrand,
    ingredients: ['Various ingredients', 'Sugar', 'Artificial flavors'],
    nutrition_facts: {
      total_carbs_g: randomSugar + 10,
      fiber_g: 2,
      sugars_g: randomSugar,
      protein_g: 3,
      fat_g: 5,
      calories: 150
    },
    serving_size_g: 100
  };
  
  const trust_score = calculateTrustScore(generatedData, 'Mock Database');
  const incomplete_flag = isIncomplete(generatedData);
  
  console.log(`[MockDB] Generated: ${generatedData.product_name} (trust: ${trust_score})`);
  
  return {
    success: true,
    foodData: generatedData,
    source: 'Mock Database',
    trust_score,
    incomplete_flag
  };
};

// API Priority Fallback Configuration
const API_SOURCES: APISource[] = [
  {
    name: 'Open Food Facts API',
    access: 'free',
    url: 'https://world.openfoodfacts.org/api/v0/product/{barcode}.json',
    doc: 'https://openfoodfacts.github.io/openfoodfacts-server/api/',
    notes: 'Community-powered. Ideal for open-source integration.',
    resolver: openFoodFactsResolver
  },
  {
    name: 'USDA FoodData Central',
    access: 'free (with API key)',
    url: 'https://api.nal.usda.gov/fdc/v1/foods/search',
    doc: 'https://fdc.nal.usda.gov/api-guide',
    notes: 'Government-grade data. Keyword-based search only.',
    resolver: usdaFoodDataResolver
  },
  {
    name: 'Edamam Food Database',
    access: 'freemium',
    url: 'https://api.edamam.com/api/food-database/v2/parser',
    doc: 'https://developer.edamam.com/food-database-api-docs',
    notes: 'Highly curated. Requires API credentials.',
    resolver: edamamResolver
  },
  {
    name: 'FatSecret Platform',
    access: 'freemium',
    url: 'https://platform.fatsecret.com/docs/v1/food.find_id_for_barcode',
    doc: 'https://platform.fatsecret.com/',
    notes: 'Broad database. Requires OAuth authentication.',
    resolver: fatSecretResolver
  },
  {
    name: 'Go-UPC API',
    access: 'free trial (1000 requests)',
    url: 'https://go-upc.com/api/v1/barcode/{barcode}',
    doc: 'https://go-upc.com/docs/python-barcode-api-lookup',
    notes: 'Retail-centric. Requires API key.',
    resolver: goUpcResolver
  },
  {
    name: 'Barcode Lookup API',
    access: 'trial/commercial',
    url: 'https://api.barcodelookup.com/v2/products',
    doc: 'https://www.barcodelookup.com/api',
    notes: 'Includes product photos and pricing. Requires API key.',
    resolver: barcodeLookupResolver
  },
  {
    name: 'Mock Database',
    access: 'free',
    url: 'local',
    doc: 'internal',
    notes: 'Fallback for demo purposes.',
    resolver: mockDatabaseResolver
  }
];

// Main resolver function
export const resolveFoodData = async (barcode: string): Promise<ResolverResult> => {
  console.log(`[FoodDataResolver] Starting resolution for barcode: ${barcode}`);
  
  // Validate barcode format
  const barcodeFormats = ['UPC-A', 'EAN-13', 'GTIN-13', 'GTIN-8'];
  if (!barcode || barcode.length < 8 || barcode.length > 14) {
    return { success: false, error: 'Invalid barcode format' };
  }
  
  // Check cache first
  const cacheKey = `barcode_${barcode}`;
  const cached = foodCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_VALIDITY_MS) {
    console.log(`[FoodDataResolver] Cache hit for barcode: ${barcode}`);
    return cached.data;
  }
  
  // Try each API source in priority order
  for (const source of API_SOURCES) {
    try {
      console.log(`[FoodDataResolver] Trying ${source.name}...`);
      const result = await source.resolver(barcode);
      
      if (result.success && result.foodData && result.trust_score) {
        // Check if result meets quality threshold
        if (result.trust_score >= 0.8 && !result.incomplete_flag) {
          console.log(`[FoodDataResolver] Success with ${source.name} (trust: ${result.trust_score})`);
          
          // Cache the result
          foodCache.set(cacheKey, { data: result, timestamp: Date.now() });
          
          return result;
        } else {
          console.log(`[FoodDataResolver] ${source.name} result below threshold (trust: ${result.trust_score}, incomplete: ${result.incomplete_flag})`);
          // Continue to next source
        }
      } else {
        console.log(`[FoodDataResolver] ${source.name} failed: ${result.error}`);
        // Continue to next source
      }
    } catch (error) {
      console.error(`[FoodDataResolver] ${source.name} threw error:`, error);
      // Continue to next source
    }
  }
  
  // If we get here, all sources failed
  console.log(`[FoodDataResolver] All sources failed for barcode: ${barcode}`);
  return {
    success: false,
    error: 'Unable to resolve food data from any source'
  };
};

// Utility function to clear cache (for testing/debugging)
export const clearFoodCache = (): void => {
  foodCache.clear();
  console.log('[FoodDataResolver] Cache cleared');
};

// Utility function to get cache stats
export const getCacheStats = (): { size: number; entries: string[] } => {
  return {
    size: foodCache.size,
    entries: Array.from(foodCache.keys())
  };
};

// Export types and constants for external use
export { API_SOURCES, CACHE_VALIDITY_DAYS };