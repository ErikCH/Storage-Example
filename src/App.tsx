import "./App.css";
import { Button, Heading, View } from "@aws-amplify/ui-react";
import { StorageManager } from "@aws-amplify/ui-react-storage";
import { signOut } from "aws-amplify/auth";
import { list } from "aws-amplify/storage";
import { useState } from "react";
function App() {
  interface Pics {
    eTag?: string | undefined;
    path: string;
  }
  const [pictures, setPictures] = useState<Pics[]>([]);
  const [profiles, setProfiles] = useState<Pics[]>([]);

  async function showFiles(path: string, entity: boolean) {
    if (entity) {
      const { items } = await list({
        path({ identityId }) {
          return `${path}${identityId}/`;
        },
      });
      setProfiles(items);
    } else {
      const { items } = await list({
        path,
      });
      setPictures(items);
    }
  }
  return (
    <>
      <Heading level={2}>Uploader for Pictures</Heading>
      <StorageManager
        maxFileCount={1}
        path={"picture-submissions/"}
        acceptedFileTypes={["image/*"]}
      ></StorageManager>

      <Button onClick={() => showFiles("picture-submissions/", false)}>
        Show Files Pictures
      </Button>
      <View>
        <View as="ul">
          {pictures.map((picture) => (
            <View as="li" key={picture.eTag}>
              {picture.path}
            </View>
          ))}
        </View>
      </View>
      <Heading level={2}>Uploader for Profiles</Heading>
      <StorageManager
        maxFileCount={1}
        path={({ identityId }) => `profile-pictures/${identityId}/`}
        acceptedFileTypes={["image/*"]}
      ></StorageManager>

      <Button onClick={() => showFiles("profile-pictures/", true)}>
        Show Profile Pictures
      </Button>
      <View>
        <View as="ul">
          {profiles.map((profile) => (
            <View as="li" key={profile.eTag}>
              {profile.path}
            </View>
          ))}
        </View>
      </View>
      <Button variation="destructive" onClick={() => signOut()}>
        Sign Out
      </Button>
    </>
  );
}

export default App;
