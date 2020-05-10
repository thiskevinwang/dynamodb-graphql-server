# Entities

`v0.8.0`

- see [AWS re:Invent 2019: Data modeling with Amazon DynamoDB (CMY304)](https://youtu.be/DIQVJqiSUkE?t=1651)

|             | PK                  | SK                                                    |
| ----------: | :------------------ | :---------------------------------------------------- |
|    **Team** | `TEAM#<team>`       | `#TEAM`                                               |
| **Channel** | `TEAM#<team>`       | `CHANNEL#<channel>`                                   |
| **Message** | `TEAM#<team>`       | `#CHANNEL#<channel>#MESSAGE#<user>#<YYYYMMDD-HHMMSS>` |
|    **User** | `USER#<user|email>` | `#USER`                                               |

# Queries

tbd.
