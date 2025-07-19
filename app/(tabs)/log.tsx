import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/colors';
import AddFoodButton from '@/components/AddFoodButton';
import ScanResultMultiModal from '@/components/ScanResultMultiModal';
import CypherNotification from '@/components/CypherNotification';
import { useFoodLogStore } from '@/store/foodLogStore';
import { useCypherStore } from '@/store/cypherStore';
import { analyzeFoodImage, searchFoodByBarcode } from '@/utils/aiUtils';
import { createFoodFromAI, createFoodFromBarcode } from '@/utils/foodUtils';
import { Camera, Image, Barcode, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function LogFoodScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showNotification, setShowNotification] = useState(false);
  
  const { addFood } = useFoodLogStore();
  const { addScan, getSniffaResponse } = useCypherStore();
  
  useEffect(() => {
    // Reset camera state when navigating away
    return () => {
      setCameraActive(false);
      setScannerActive(false);
    };
  }, []);
  
  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera permission to use this feature"
        );
        return;
      }
    }
    
    setCameraActive(true);
    setScannerActive(false);
  };
  
  const handleScanBarcode = async () => {
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera permission to use this feature"
        );
        return;
      }
    }
    
    setCameraActive(false);
    setScannerActive(true);
  };
  
  const handleManualEntry = () => {
    router.push('/food/add');
  };
  
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };
  
  const handleCameraCapture = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // In a real app, you would capture the photo here
    // For this demo, we'll use a sample image URL
    const sampleImageUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000';
    processImage(sampleImageUrl);
  };
  
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (isProcessing) return;
    
    console.log('Barcode scanned:', data);
    setIsProcessing(true);
    
    if (Platform.OS !== 'web') {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
    
    try {
      const barcodeData = await searchFoodByBarcode(data);
      const food = createFoodFromBarcode(barcodeData, data);
      
      console.log('Food created from barcode:', food);
      
      // Create enhanced scan result for multimodal display
      const enhancedResult = {
        name: food.name,
        totalSugars: food.sugarPerServing,
        addedSugars: food.sugarPerServing * 0.8, // Estimate
        aliases: food.hiddenSugars || [],
        glycemicIndex: food.glycemicIndex || 65,
        labelTricks: ['Ingredient splitting'],
        sweetenerType: 'Artificial + Natural Mix',
        hiddenSugars: food.hiddenSugars || []
      };
      
      // Add to cypher history
      addScan({
        productName: food.name,
        barcode: data,
        scanDate: Date.now(),
        sugarContent: food.sugarPerServing,
        hiddenSugars: food.hiddenSugars || [],
        cypherMode: 'sniffa'
      });
      
      addFood(food);
      setScanResult(enhancedResult);
      setScannerActive(false);
      
      // Show notification if high sugar
      if (food.sugarPerServing > 15) {
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Barcode scan error:', error);
      setScannerActive(false);
      Alert.alert(
        "Product Not Found",
        "We couldn't find this product in our database. Would you like to add it manually?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              console.log('User cancelled manual entry');
              setScannerActive(false);
              setCameraActive(false);
            }
          },
          { 
            text: "Add Manually", 
            onPress: () => {
              console.log('User chose manual entry');
              setScannerActive(false);
              setCameraActive(false);
              router.push('/food/add');
            }
          }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  const processImage = async (imageUri: string) => {
    setIsProcessing(true);
    setCameraActive(false);
    
    try {
      const analysis = await analyzeFoodImage(imageUri);
      const food = createFoodFromAI(analysis);
      
      // Add image URI to the food object
      food.imageUri = imageUri;
      
      // Create enhanced scan result
      const enhancedResult = {
        name: food.name,
        totalSugars: food.sugarPerServing,
        addedSugars: food.sugarPerServing * 0.7,
        aliases: food.hiddenSugars,
        glycemicIndex: food.glycemicIndex || 60,
        labelTricks: ['Natural flavoring'],
        sweetenerType: 'Natural + Added',
        hiddenSugars: food.hiddenSugars
      };
      
      // Add to cypher history
      addScan({
        productName: food.name,
        scanDate: Date.now(),
        sugarContent: food.sugarPerServing,
        hiddenSugars: food.hiddenSugars,
        cypherMode: 'cypher'
      });
      
      addFood(food);
      setScanResult(enhancedResult);
      
      // Show notification if high sugar
      if (food.sugarPerServing > 15) {
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Error analyzing food image:', error);
      Alert.alert(
        "Analysis Failed",
        "We couldn't analyze this image. Please try again or add the food manually.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              setCameraActive(false);
              setScannerActive(false);
            }
          },
          {
            text: "Try Again",
            onPress: () => {
              setCameraActive(true);
              setScannerActive(false);
            }
          },
          {
            text: "Add Manually",
            onPress: () => {
              setCameraActive(false);
              setScannerActive(false);
              router.push('/food/add');
            }
          }
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderCameraView = () => {
    if (!permission?.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>We need your permission to use the camera</Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={scannerActive ? {
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
          } : undefined}
          onBarcodeScanned={scannerActive ? handleBarcodeScanned : undefined}
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setCameraActive(false);
                setScannerActive(false);
              }}
            >
              <X size={24} color="white" />
            </TouchableOpacity>
            
            {scannerActive ? (
              <View style={styles.scannerFrame}>
                <Text style={styles.scannerText}>
                  {isProcessing ? 'DECRYPTING...' : 'Align barcode within frame'}
                </Text>
              </View>
            ) : (
              <View style={styles.captureContainer}>
                <TouchableOpacity 
                  style={styles.flipButton}
                  onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                >
                  <Camera size={24} color="white" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.captureButton}
                  onPress={handleCameraCapture}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <View style={[styles.captureButtonInner, { opacity: 0.7 }]} />
                  ) : (
                    <View style={styles.captureButtonInner} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.galleryButton}
                  onPress={handlePickImage}
                >
                  <Image size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'SugarCypher Scanner' }} />
      
      <CypherNotification
        visible={showNotification}
        productName={scanResult?.name || ''}
        sugarContent={scanResult?.totalSugars || 0}
        onDismiss={() => setShowNotification(false)}
      />
      
      {(cameraActive || scannerActive) ? (
        renderCameraView()
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Ready to crack some codes?</Text>
          <Text style={styles.subtitle}>Choose your scanning method, Shoog!</Text>
          
          <View style={styles.buttonsContainer}>
            <AddFoodButton 
              type="camera" 
              onPress={handleTakePhoto} 
              style={styles.logButton}
            />
            
            <AddFoodButton 
              type="barcode" 
              onPress={handleScanBarcode} 
              style={styles.logButton}
            />
            
            <AddFoodButton 
              type="manual" 
              onPress={handleManualEntry} 
              style={styles.logButton}
            />
          </View>
          
          {/* Demo buttons for testing */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>🧪 Demo Mode</Text>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => handleBarcodeScanned({ data: '049000006346' })}
            >
              <Text style={styles.demoButtonText}>Test Coca-Cola Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => handleBarcodeScanned({ data: '222222222222' })}
            >
              <Text style={styles.demoButtonText}>Test Energy Drink Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => handleBarcodeScanned({ data: 'random123456' })}
            >
              <Text style={styles.demoButtonText}>Test Random Product</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.infoText}>
            ShoogSniffa™ will analyze your scan and give you the real deal on what's hiding in your food.
          </Text>
        </View>
      )}
      
      {scanResult && (
        <ScanResultMultiModal
          result={scanResult}
          onClose={() => {
            setScanResult(null);
            router.push('/');
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  logButton: {
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: Colors.subtext,
    textAlign: 'center',
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 30,
    width: '100%',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  flipButton: {
    padding: 10,
  },
  galleryButton: {
    padding: 10,
  },
  scannerFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 5,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoSection: {
    width: '100%',
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  demoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});