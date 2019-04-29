#Internals

## Connection
All websocket connections have to use `ws://localhost:3000/socket.io/?role=<ROLE>&user=<USER>&token=<TOKEN>` as URL. `<VAR>` has to be replaced by the following values:

### Parameter
- **ROLE** :'student'|'lecturer'
- **USER** :string Username of lecturer or student. Student username should be a random 20 character string.
- **TOKEN** :string SHA256 hash of `username|auth`, whereby `username` is the username of the corresponding user and `auth` the plaintext password of the lecturer or the student code (which is displayed at the beginning of every lecture).

## Events
### on page
Triggered if page/slide gets changed.

```
{
    index: number,
    previousUrl: string,
    url: string,
    nextUrl: string,
    poll: string[][],
    votes: number[][],
    votedIds: string[],
    progress: number,
}
```

### emit ready
Should be triggered after all hooks are ready.

### emit comment

### emit vote

### on statistic (lecturer)
Gets triggered each time a user joins or leaves.

```
{
    connectedUsers: number
}
```

### on vote (lecturer)
Gets triggered each time a user votes.

```
{
    slideIndex: number,
    choice: string
}
```

### on comment (lecturer)
Gets triggered if a student wrote a comment.

```
{
    index: number,
    comment: string,
    date: string
}
```

### emit poll (lecturer)
Update poll for given slide index.

```
{
    index: number,
    question?: string,
    choices?: string[]
}
```

### emit move (lecturer)
Each time the move event is triggered, the slide index will be decremented or incremented.

```
direction: -1|1
```

### emit get (lecturer)

### emit config (lecturer)
