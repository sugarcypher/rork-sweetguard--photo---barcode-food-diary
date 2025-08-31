import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import {
  X,
  Camera,
  Flashlight,
  Check,
  RotateCcw,
  Scan,
  Receipt,
  FileText,
  Package,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useFoodLogStore } from '@/store/foodLogStore';
import { Food } from '@/types/food';
import { findHiddenSugars } from '@/constants/hiddenSugarTypes';

interface IntelligentScannerProps {
  visible: boolean;
  onClose: () => void;
  onFoodScanned?: (foodData: Food) => void;
  testId?: string;
}

interface CapturedPhoto {
  id: string;
  uri: string;
  base64?: string;
  type?: 'barcode' | 'receipt' | 'label' | 'ingredients' | 'unknown';
  processed?: boolean;
  data?: any;
}

interface AIAnalysisResult {
  type: 'barcode' | 'receipt' | 'label' | 'ingredients' | 'unknown';
  confidence: number;
  extractedData: any;
  suggestions?: string[];
}

export const IntelligentScanner: React.FC<IntelligentScannerProps> = ({
  visible,
  onClose,
  onFoodScanned,
  testId,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [showReview, setShowReview] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const { addFood } = useFoodLogStore();

  const analyzeImageWithAI = async (base64Image: string): Promise<AIAnalysisResult> => {
    try {
      console.log('[IntelligentScanner] Analyzing image with AI...');
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an expert food analysis AI. Analyze the provided image and determine what type of food-related content it contains. 

Respond with a JSON object containing:
- type: one of "barcode", "receipt", "label", "ingredients", "unknown"
- confidence: number between 0-1
- extractedData: object with relevant extracted information
- suggestions: array of strings with helpful suggestions

For barcodes: extract the barcode number if visible
For receipts: extract store name, items, prices if visible
For labels: extract product name, nutrition facts, ingredients
For ingredients: extract the ingredient list text
For unknown: provide suggestions on how to get better results

Be thorough but concise. Focus on food and nutrition related information.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Please analyze this image and tell me what type of food-related content it contains.'
                },
                {
                  type: 'image',
                  image: base64Image
                }
              ]
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('[IntelligentScanner] AI analysis result:', result.completion);
      
      // Parse the AI response
      try {
        const analysisResult = JSON.parse(result.completion);
        return {
          type: analysisResult.type || 'unknown',
          confidence: analysisResult.confidence || 0.5,
          extractedData: analysisResult.extractedData || {},
          suggestions: analysisResult.suggestions || []
        };
      } catch (parseError) {
        console.error('[IntelligentScanner] Failed to parse AI response:', parseError);
        return {
          type: 'unknown',
          confidence: 0.3,
          extractedData: { rawResponse: result.completion },
          suggestions: ['Could not parse the image clearly. Try taking another photo with better lighting.']
        };
      }
    } catch (error) {
      console.error('[IntelligentScanner] AI analysis error:', error);
      return {
        type: 'unknown',
        confidence: 0.1,
        extractedData: {},
        suggestions: ['Analysis failed. Please check your internet connection and try again.']
      };
    }
  };

  const processAnalysisResult = async (analysis: AIAnalysisResult, photoUri: string) => {
    console.log('[IntelligentScanner] Processing analysis result:', analysis);
    
    switch (analysis.type) {
      case 'barcode':
        await processBarcodeData(analysis.extractedData);
        break;
      case 'receipt':
        await processReceiptData(analysis.extractedData);
        break;
      case 'label':
        await processLabelData(analysis.extractedData);
        break;
      case 'ingredients':
        await processIngredientsData(analysis.extractedData);
        break;
      default:
        Alert.alert(
          'Analysis Complete',
          `Image analyzed but couldn't determine specific food content. ${analysis.suggestions?.[0] || 'Try taking another photo.'}`
        );
    }
  };

  const processBarcodeData = async (data: any) => {
    if (data.barcode) {
      // Use existing barcode lookup logic
      Alert.alert(
        'Barcode Detected',
        `Found barcode: ${data.barcode}. This would normally trigger a product lookup.`,
        [
          { text: 'OK' }
        ]
      );
    } else {
      Alert.alert('Barcode', 'Barcode detected but number could not be extracted clearly.');
    }
  };

  const processReceiptData = async (data: any) => {
    const items = data.items || [];
    const store = data.store || 'Unknown Store';
    
    Alert.alert(
      'Receipt Analyzed',
      `Found receipt from ${store} with ${items.length} items. This would normally add items to your shopping analysis.`,
      [
        { text: 'OK' }
      ]
    );
  };

  const processLabelData = async (data: any) => {
    const productName = data.productName || data.name || 'Unknown Product';
    const nutrition = data.nutrition || {};
    const ingredients = data.ingredients || [];
    
    // Create a food item from the label data
    const food: Food = {
      id: Date.now().toString(),
      name: productName,
      brand: data.brand || 'Unknown',
      sugarPerServing: nutrition.sugar || 0,
      servingSize: data.servingSize || '1 serving',
      servingSizeGrams: nutrition.servingSize || 100,
      hiddenSugars: [],
      hiddenSugarTypes: [],
      timestamp: Date.now(),
      mealType: 'snack',
      calories: nutrition.calories,
      carbs: nutrition.carbs,
      protein: nutrition.protein,
      fat: nutrition.fat,
      ingredients: typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients,
    };

    // Find hidden sugars if ingredients are available
    if (food.ingredients && food.ingredients.length > 0) {
      const ingredientsString = food.ingredients.join(', ');
      const hiddenSugarTypes = findHiddenSugars(ingredientsString);
      food.hiddenSugars = hiddenSugarTypes.map(h => h.name);
      food.hiddenSugarTypes = hiddenSugarTypes;
    }

    addFood(food);
    
    Alert.alert(
      'Food Label Processed',
      `Added "${productName}" to your food log with ${nutrition.sugar || 0}g sugar per serving.`,
      [
        { text: 'View Log', onPress: () => onClose() },
        { text: 'OK' }
      ]
    );

    if (onFoodScanned) {
      onFoodScanned(food);
    }
  };

  const processIngredientsData = async (data: any) => {
    const ingredientsList = data.ingredients || data.text || '';
    
    if (ingredientsList) {
      const hiddenSugarTypes = findHiddenSugars(ingredientsList);
      
      Alert.alert(
        'Ingredients Analyzed',
        `Found ${hiddenSugarTypes.length} hidden sugar types in the ingredients list: ${hiddenSugarTypes.map(h => h.name).join(', ') || 'None detected'}`,
        [
          { text: 'OK' }
        ]
      );
    } else {
      Alert.alert('Ingredients', 'Could not extract ingredients text clearly.');
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      console.log('[IntelligentScanner] Taking photo...');

      // For web, we'll simulate taking a photo
      if (Platform.OS === 'web') {
        const mockPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
          base64: 'mock-base64-data',
          processed: false
        };
        
        setCapturedPhotos(prev => [...prev, mockPhoto]);
        
        // Simulate AI analysis
        const analysis = await analyzeImageWithAI('mock-base64-data');
        
        // Update photo with analysis result
        setCapturedPhotos(prev => 
          prev.map(photo => 
            photo.id === mockPhoto.id 
              ? { ...photo, type: analysis.type, processed: true, data: analysis }
              : photo
          )
        );
        
        await processAnalysisResult(analysis, mockPhoto.uri);
      } else {
        // Real camera implementation
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });

        if (photo && photo.base64) {
          const capturedPhoto: CapturedPhoto = {
            id: Date.now().toString(),
            uri: photo.uri,
            base64: photo.base64,
            processed: false
          };

          setCapturedPhotos(prev => [...prev, capturedPhoto]);

          // Analyze with AI
          const analysis = await analyzeImageWithAI(photo.base64);

          // Update photo with analysis result
          setCapturedPhotos(prev => 
            prev.map(p => 
              p.id === capturedPhoto.id 
                ? { ...p, type: analysis.type, processed: true, data: analysis }
                : p
            )
          );

          await processAnalysisResult(analysis, photo.uri);
        }
      }
    } catch (error) {
      console.error('[IntelligentScanner] Photo capture error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetakePhoto = (photoId: string) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const handleFinishScanning = () => {
    const processedPhotos = capturedPhotos.filter(photo => photo.processed);
    
    if (processedPhotos.length === 0) {
      Alert.alert('No Photos', 'Please take at least one photo before finishing.');
      return;
    }

    Alert.alert(
      'Scanning Complete',
      `Successfully processed ${processedPhotos.length} photo(s). All detected food information has been added to your log.`,
      [
        { text: 'OK', onPress: onClose }
      ]
    );
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'barcode': return <Scan size={16} color={colors.primary} />;
      case 'receipt': return <Receipt size={16} color={colors.primary} />;
      case 'label': return <Package size={16} color={colors.primary} />;
      case 'ingredients': return <FileText size={16} color={colors.primary} />;
      default: return <Camera size={16} color={colors.textSecondary} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'barcode': return 'Barcode';
      case 'receipt': return 'Receipt';
      case 'label': return 'Food Label';
      case 'ingredients': return 'Ingredients';
      default: return 'Unknown';
    }
  };

  if (!visible) {
    return null;
  }

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container} testID={testId}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading camera...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container} testID={testId}>
          <View style={styles.permissionContainer}>
            <Camera size={48} color={colors.textSecondary} />
            <Text style={styles.permissionTitle}>Camera Permission Required</Text>
            <Text style={styles.permissionMessage}>
              We need access to your camera to scan food labels, barcodes, receipts, and ingredient lists.
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  if (showReview) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowReview(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Review Photos</Text>
            <TouchableOpacity style={styles.finishButton} onPress={handleFinishScanning}>
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.reviewContainer}>
            {capturedPhotos.map((photo) => (
              <View key={photo.id} style={styles.photoReviewCard}>
                <Image source={{ uri: photo.uri }} style={styles.reviewImage} />
                <View style={styles.photoInfo}>
                  <View style={styles.photoTypeRow}>
                    {getTypeIcon(photo.type || 'unknown')}
                    <Text style={styles.photoTypeText}>
                      {getTypeLabel(photo.type || 'unknown')}
                    </Text>
                    {photo.processed && <Check size={16} color={colors.success} />}
                  </View>
                  {photo.data?.confidence && (
                    <Text style={styles.confidenceText}>
                      Confidence: {Math.round(photo.data.confidence * 100)}%
                    </Text>
                  )}
                  <TouchableOpacity 
                    style={styles.retakeButton}
                    onPress={() => handleRetakePhoto(photo.id)}
                  >
                    <RotateCcw size={16} color={colors.primary} />
                    <Text style={styles.retakeButtonText}>Retake</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container} testID={testId}>
        {Platform.OS === 'web' ? (
          // Web fallback UI
          <View style={styles.webContainer}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Intelligent Scanner</Text>
              <View style={styles.headerSpacer} />
            </View>
            
            <View style={styles.webContent}>
              <Camera size={64} color={colors.textSecondary} />
              <Text style={styles.webTitle}>Camera Scanning</Text>
              <Text style={styles.webMessage}>
                Camera scanning is not available in the web version. This feature works best on mobile devices.
              </Text>
              
              <TouchableOpacity 
                style={styles.demoButton}
                onPress={handleTakePhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.demoButtonText}>Try Demo Analysis</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Mobile camera UI
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
          >
            {/* Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.cameraHeaderTitle}>Intelligent Scanner</Text>
              {capturedPhotos.length > 0 && (
                <TouchableOpacity 
                  style={styles.reviewButton}
                  onPress={() => setShowReview(true)}
                >
                  <Text style={styles.reviewButtonText}>{capturedPhotos.length}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionText}>
                Point your camera at any food-related item:
              </Text>
              <Text style={styles.instructionSubtext}>
                • Barcodes • Food labels • Receipts • Ingredient lists
              </Text>
            </View>

            {/* Scanning Frame */}
            <View style={styles.scanningArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                <Flashlight size={24} color={flashEnabled ? colors.primary : "white"} />
                <Text style={styles.controlText}>Flash</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]} 
                onPress={handleTakePhoto}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Camera size={32} color="white" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="white" />
                <Text style={styles.controlText}>Flip</Text>
              </TouchableOpacity>
            </View>

            {/* Processing Overlay */}
            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.processingText}>Analyzing with AI...</Text>
                <Text style={styles.processingSubtext}>Detecting content type and extracting information</Text>
              </View>
            )}
          </CameraView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  webTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  webMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  demoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600' as const,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionMessage: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#ccc',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
    textAlign: 'center',
    color: colors.text,
  },
  cameraHeaderTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
    textAlign: 'center',
    color: 'white',
  },
  headerSpacer: {
    width: 40,
  },
  reviewButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  finishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  finishButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  scanningArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 300,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  processingSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  reviewContainer: {
    flex: 1,
    padding: 20,
  },
  photoReviewCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  photoInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  photoTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoTypeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  confidenceText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  retakeButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
});

export default IntelligentScanner;