import React from 'react';
import { Icon } from 'expo';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  ActivityIndicator,
  TextInput
} from 'react-native';
import Colors from '../constants/Colors';
import Dialog, { SlideAnimation, DialogContent, DialogTitle, DialogButton } from 'react-native-popup-dialog';
import { Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo';
import { TextField } from 'react-native-material-textfield';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default class KramDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      recipients: [{ name: '', contact: '' }, { name: '', contact: '' }]
    }
    this.recipientsCount = 1;
  }

  onChangeText = (field, value) => {
    this.setState({ [field]: value });
  }

  onChangeRecipants = (index, field, value) => {
    let newRecipients = [...this.state.recipients];
    newRecipients[index][field] = value;
    if (index+1 === this.state.recipients.length)
      newRecipients.push({ name: '', contact: '' });
    this.setState({ recipients: newRecipients });
  }

  renderKramView = () => {
    return (
      !this.props.isItemView && this.props.isKramView && !this.props.isPaymentSuccessView && !this.props.isLoading &&
      <View style={{ flex: 1, margin: 24 }}>
      <Text style={[styles.sectionText, { marginBottom: 20 }]}>Split evenly among the group</Text>
        <Text style={styles.sectionText}>Your group</Text>
        <View style={styles.textFieldRow}>
          <TextField
            label='Your Name'
            labelTextStyle={styles.labelText}
            value={this.state.name}
            containerStyle={{ flex: 1, marginRight: 12 }}
            onChangeText={ (name) => this.onChangeText('name', name) }
          />
          <TextField
            label='Your Email'
            labelTextStyle={styles.labelText}
            value={this.state.email}
            containerStyle={{ flex: 1 }}
            onChangeText={ (email) => this.onChangeText('email', email) }
          />
        </View>
        <Text style={styles.sectionText}>Invitees</Text>
        { this.renderRecipants() }
        <Text style={styles.sectionText}>Your credit information</Text>
        <CreditCardInput onChange={this._onChange} />
      </View>
    )
  }

  renderRecipants = () => {
    return this.state.recipients.map((item, i) => (
      <View style={styles.textFieldRow} key={i}>
        <TextField
          label='Name'
          labelTextStyle={styles.labelText}
          value={item.name}
          containerStyle={{ flex: 1, marginRight: 12 }}
          onChangeText={ (name) => this.onChangeRecipants(i, 'name', name) }
        />
        <TextField
          label='Contact'
          labelTextStyle={styles.labelText}
          value={item.contact}
          containerStyle={{ flex: 1 }}
          onChangeText={ (contact) => this.onChangeRecipants(i, 'contact', contact) }
        />
      </View>
    ))
  }

  render() {
    return (
      <View style={styles.container}>
        <Dialog
          key={Object.keys(this.props)}
          visible={this.props.isOpenDialog}
          dialogAnimation={new SlideAnimation({
            slideFrom: 'bottom'
          })}
          actions={!this.props.isLoading ? [
            <DialogButton
              key={0}
              text="Checkout"
              onPress={this.props.toggleDialog}
            />,
            <DialogButton
              key={1}
              text={"KRAM"}
              onPress={() => { this.props.handleAction() }}
            />
          ] : []}
          width={WINDOW_WIDTH}
          height={WINDOW_HEIGHT}
          containerStyle={[{ flex: 1 }, Platform.OS === 'android' && { marginTop: Constants.statusBarHeight }]}
          onTouchOutside={this.props.toggleDialog}
        >
        <DialogTitle textStyle={styles.plaintext} style={styles.title} title={this.props.title} />
        {
          this.props.isItemView && !this.props.isKramView && !this.props.isPaymentSuccessView && !this.props.isLoading &&
          <ScrollView style={styles.content}>
              <View style={styles.image}>
                <Image
                     style={{ height: WINDOW_WIDTH/2 + 40, width: WINDOW_WIDTH }}
                     source={this.props.imageUrl}
                     resizeMode="cover"
                />
              </View>
              <View style={[styles.infoRow, { marginTop: 16 }]}>
                <View style={styles.icon}>
                  <Ionicons name="md-time" size={24.5} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.time}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-pricetag" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{`$${this.props.price}`}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-heart" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{`${this.props.likes} Likes`}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-cube" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.condition}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-grid" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.type}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.icon}>
                  <Ionicons name="md-information-circle" size={24} color="grey" />
                </View>
                <View>
                  <Text style={styles.greysubtext}>{this.props.description}</Text>
                </View>
              </View>
            </ScrollView>
        }
        { this.renderKramView() }
        {
          !this.props.isItemView && !this.props.isKramView && this.props.isPaymentSuccessView && !this.props.isLoading &&
          <View>
            <Text> HELLO></Text>
          </View>
        }
        {
          this.props.isLoading &&
          <View style={styles.loaderContainer}>
            <ActivityIndicator style={{ marginBottom: 20}} size="large" color='rgba(63, 63, 191, 1)' />
            <Text style={styles.subtext}>Powered by KRAM</Text>
          </View>
        }
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 25,
  },
  container: {
    flex: 1,
    marginBottom: 50
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  plaintext: {
    fontFamily: 'Avenir',
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500'
  },
  sectionText: {
    fontFamily: 'Avenir',
    fontSize: 20,
    lineHeight: 25,
  },
  subtext: {
    fontFamily: 'Avenir',
    fontSize: 16,
    lineHeight: 25,
  },
  greysubtext: {
    fontFamily: 'Avenir',
    color: 'grey',
    fontSize: 16,
    lineHeight: 25,
  },
  link: {
    fontFamily: 'Avenir',
    color: '#0099CC',
    fontSize: 16,
    lineHeight: 25,
    paddingLeft: 5,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 30,
    height: 30
  },
  content: {
    flex: 1,
    alignItems: 'stretch'
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textFieldRow: {
    flexDirection: 'row',
  },
  labelText: {
    fontFamily: 'Avenir',
    color: 'rgba(63, 63, 191, 1)'
  }
});
