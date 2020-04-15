import * as React from 'react'
import { StyleSheet, Text, View, SectionList, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';

export default function InfoScreen() {
  return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.contentView}>
            <Text style={styles.title}>Source</Text>
            <Text style={styles.body}>All data used in this application is from the following Github repository:</Text>
            <Button title="CSSEGISandData/COVID-19" onPress={handleGithubLinkPress}></Button>
            <Text style={styles.body}>Source code can be found at:</Text>
            <Button title="Source Code on Github" onPress={handleGithubSourceCodeLinkPress}></Button>
          </View>
          <View style={styles.contentView}>
            <Text style={styles.title}>CDC Information Page</Text>
            <Button title="CDC COVID-19" onPress={handleCDCLinkPress}></Button>
          </View>
          <View style={styles.contentView}>
            <Text style={styles.body}>
              All data used Maintained and provided by the Center for Systems Science and Engineering 
              (CSSE) at Johns Hopkins University (JHU)
            </Text>
            <Button title="CSSE website" onPress={handleWebsiteLinkPress}></Button>
          </View>
        </View>

      </ScrollView>
  );
}

function handleGithubLinkPress() {
  WebBrowser.openBrowserAsync('https://github.com/CSSEGISandData/COVID-19');
}

function handleGithubSourceCodeLinkPress() {
  WebBrowser.openBrowserAsync('https://github.com/thebrandonlucas/covid-19')
}

function handleCDCLinkPress() {
  WebBrowser.openBrowserAsync('https://www.cdc.gov/coronavirus/2019-ncov/index.html');
}

function handleOnlineDashboardLinkPress() {
  WebBrowser.openBrowserAsync('https://www.arcgis.com/apps/opsdashboard/index.html#/85320e2ea5424dfaaa75ae62e5c06e61');
}

function handleWebsiteLinkPress() {
  WebBrowser.openBrowserAsync('https://systems.jhu.edu/');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', 
    // alignContent: 'center', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    textAlign: 'center', 
  },
  contentView: {
    margin: 20,
    flex: 1, 
  }, 
  title: {
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight: 'bold', 
  }, 
  body: {
    textAlign: 'center', 
    fontSize: 20, 
  }
  
});
