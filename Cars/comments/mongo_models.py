# models_mongo.py
# import mongoengine as me
from mongoengine import (
    Document,
    IntField,
    StringField,
    DateTimeField,
    BooleanField,
    ListField,
    ReferenceField,
    connect,
)
import datetime as dt

connect("cars", host="localhost", port=27017)


class CCBComments(Document):
    req_sec_sub_section_id = IntField(required=True)
    sequence = IntField(required=True)
    comment = StringField()
    comment_on = DateTimeField()
    comment_by = IntField()

    meta = {"collection": "ccbcomments", "ordering": ["-comment_on"]}


class CCBAttachments(Document):
    req_sec_sub_section_id = IntField(required=True)
    sequence = IntField(required=True)
    attachment_name = StringField(required=True, max_length=50)
    attachment_link = StringField(max_length=256)
    attached_by = IntField()

    meta = {"collection": "ccbattachments", "ordering": ["-id"]}



class Comment(Document):
    post_id = StringField(
        required=True
    )  # ID of the post/article this comment belongs to
    user_id = StringField(required=True)  # user who made the comment
    parent = ReferenceField("self", null=True)  # allows nesting
    text = StringField(required=True)
    likes = ListField(StringField())  # store user_ids who liked
    dislikes = ListField(StringField())  # store user_ids who disliked
    created_at = DateTimeField(default=dt.datetime.now(dt.timezone.utc))
    updated_at = DateTimeField(default=dt.datetime.now(dt.timezone.utc))

    meta = {"collection": "comments", "ordering": ["-created_at"]}


class Attachment(Document):
    file_name = StringField(required=True)   # User-provided name
    file_path = StringField(required=True)   # Local file system path
    file_type = StringField()                # MIME type / extension
    uploaded_at = DateTimeField(default=dt.datetime.now(dt.timezone.utc))

    meta = {'collection': 'attachments'}




if __name__ == "__main__":
    from datetime import datetime

    # Create a comment record
    comment = CCBComments(
        req_sec_sub_section_id=101,
        sequence=1,
        comment="This is a test comment.",
        comment_on=datetime.now(),
        comment_by=1001,
    )

    # Save to MongoDB (collection: ccbcomments)
    comment.save()

    print("Comment saved:", comment.id)

    # Create an attachment record
    attachment = CCBAttachments(
        req_sec_sub_section_id=101,
        sequence=1,
        attachment_name="test_doc.pdf",
        attachment_link="http://example.com/test_doc.pdf",
        attached_by=1001,
    )

    # Save to MongoDB (collection: ccbattachments)
    attachment.save()

    print("Attachment saved:", attachment.id)
