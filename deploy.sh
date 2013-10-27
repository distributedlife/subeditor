echo `git rev-parse HEAD` > version.html

s3cmd sync --acl-public index.html subeditor.js subeditor.css version.html reference.json s3://subeditor/