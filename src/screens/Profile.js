import React from "react";
import moment from "moment";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Modal,
  AsyncStorage
} from "react-native";
import { CameraComponent } from "../components/CameraComponent";
import * as Permissions from "expo-permissions";

const profile = {
  picture:
    "https://secure.gravatar.com/avatar/f50a9db56e231198af3507f10b5d5491?d=mm",
  email: "rafael.fuzifaru@gmail.com",
  first_name: "Rafael",
  last_name: "Fuzifaru Cianci",
  phone: "(48) 99110-3535",
  gender: 1,
  birthday: "1993-04-27T00:00:00-03:00",
  linkedin: "https://www.linkedin.com/in/rafaelcianci",
  github: "http://github.com/rafacianci",
  address: {
    Street: "",
    ZipCode: "",
    Number: "",
    ComplementaryAddress: ""
  },
  language: ["Português - PT", "Inglês - EN", "Japonês - JA"],
  name: "Rafael Fuzifaru Cianci"
};

export default class Profile extends React.PureComponent {
  fadeAnimation = new Animated.Value(0);

  state = {
    loading: true,
    openCamera: false,
    profilePicture: profile.picture
  };

  async componentDidMount() {
    this.finishLoading();
    await this.updatePicture();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  /**
   * @param {boolean} open
   * @memberof Profile
   */
  setOpenCamera = open => {
    this.setState({ openCamera: open });
    if (!open) {
      this.updatePicture();
    }
  };

  updatePicture = async () => {
    /** @var string */
    let picture = await AsyncStorage.getItem("userImage");
    if (picture) {
      this.setState({
        // profilePicture: picture
        profilePicture:
          picture.indexOf("base64") > -1
            ? picture
            : `data:image/jpg;base64,${picture}`
      });
    } else {
      this.setState({ profilePicture: profile.picture });
    }
  };

  finishLoading = async () => {
    try {
      // await new Promise(resolve => setTimeout(resolve, 600));
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start();

      this.setState({ loading: false });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const profilePicture = this.state.profilePicture;
    return (
      <View style={styles.container}>
        {this.state.openCamera && (
          <StatusBar hidden={this.state.openCamera} className="status-bar" />
        )}
        <View style={styles.header}>
          <Image
            className="header-image"
            style={styles.headerImage}
            source={{
              uri:
                "https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png"
            }}
          />
        </View>
        {this.state.loading && (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#7800ff" />
          </View>
        )}
        {!this.state.loading && (
          <ScrollView>
            <View style={styles.profileTitle}>
              <TouchableOpacity
                className="profile-image-btn"
                onPress={() => this.setOpenCamera(true)}
              >
                <Image
                  className="profile-image"
                  style={styles.profileImage}
                  source={{ uri: profilePicture }}
                />
              </TouchableOpacity>
              <Text className="profile-name" style={styles.profileName}>
                {profile.name}
              </Text>
            </View>
            <Animated.View
              className="contact-content"
              style={[styles.userContent, { opacity: this.fadeAnimation }]}
            >
              <Text className="contact-label" style={styles.contentLabel}>
                Linkedin:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.linkedin}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Github:
              </Text>
              <Text className="contact-value" style={styles.contentText}>
                {profile.github}
              </Text>
            </Animated.View>
            <Animated.View
              className="contact-content"
              style={[styles.userContent, { opacity: this.fadeAnimation }]}
            >
              <Text className="contact-label" style={styles.contentLabel}>
                E-mail:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.email}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Celular:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.phone}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Data de Nascimento:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {moment(profile.birthday).format("DD/MM/YYYY")}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Sexo:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.gender === 1 ? "Masculino" : "Feminino"}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Idiomas:
              </Text>
              <View style={styles.languageContent}>
                {profile.language.map(language => (
                  <View key={language} style={styles.language}>
                    <Text
                      className="contact-language"
                      style={styles.languageText}
                    >
                      {language}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        )}

        <Modal
          className="modal"
          animationType="slide"
          transparent={false}
          visible={this.state.openCamera}
          onRequestClose={() => {
            this.setOpenCamera(false);
          }}
        >
          {this.state.openCamera && (
            <CameraComponent setOpenCamera={this.setOpenCamera} />
          )}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#7800ff",
    borderBottomWidth: 2,
    padding: 16,
    paddingTop: 55
  },
  headerImage: {
    height: 45,
    width: 250
  },
  title: {
    color: "#7800ff",
    fontSize: 30,
    padding: 16
  },
  profileTitle: {
    alignItems: "center",
    flexDirection: "row",
    padding: 16
  },
  profileImage: {
    borderRadius: 22,
    height: 45,
    width: 45
  },
  profileName: {
    color: "#7800ff",
    fontSize: 20,
    paddingLeft: 16
  },
  userContent: {
    backgroundColor: "#000",
    borderRadius: 2,
    margin: 16,
    padding: 16,
    marginTop: 0
  },
  contentLabel: {
    color: "#FFFFFF",
    fontSize: 11
  },
  contentText: {
    color: "#FFFFFF",
    fontSize: 14
  },
  mBottom: {
    marginBottom: 16
  },
  languageContent: {
    alignItems: "center",
    flexDirection: "row"
  },
  language: {
    backgroundColor: "#666",
    borderRadius: 50,
    marginRight: 16,
    marginTop: 8
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 14,
    padding: 5,
    paddingHorizontal: 10
  }
});
