import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

export class CameraComponent extends React.Component {
  state = {
    hasCameraPermission: false,
    isLoading: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  takePicture = async () => {
    if (window.camera) {
      try {
        this.setState({ isLoading: true });
        const options = { base64: true };
        const data = await window.camera.takePictureAsync(options);
        await AsyncStorage.setItem(
          "userImage",
          `data:image/jpg;base64,${data.base64}`
          // data.base64
        );
        this.props.setOpenCamera(false);
      } catch (error) {
        this.setState({ isLoading: false });
        alert(error.message);
      }
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Camera
          style={styles.container}
          type={Camera.Constants.Type.front}
          ref={ref => (window.camera = ref)}
        >
          <View
            className="camera-container"
            style={{
              ...styles.containerBtns,
              display: this.state.isLoading ? "none" : "flex"
            }}
          >
            <View style={styles.btnClose}>
              <TouchableOpacity
                className="camera-close"
                onPress={() =>
                  setTimeout(() => {
                    this.props.setOpenCamera(false);
                  }, 200)
                }
              >
                <Text style={styles.btnCloseText}>X</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.btnShot}>
              <TouchableOpacity
                className="camera-shot"
                onPress={() => this.takePicture()}
              >
                <Text style={styles.btnShotText}>Tirar Foto</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerBtns: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  btnClose: {
    flex: 0.1,
    alignSelf: "flex-start",
    alignItems: "center"
  },
  btnCloseText: {
    fontSize: 18,
    marginBottom: 10,
    color: "white"
  },
  btnShot: {
    flex: 0.2,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  btnShotText: {
    fontSize: 18,
    marginBottom: 10,
    color: "white"
  }
});
