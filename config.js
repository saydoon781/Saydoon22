module.exports = {
        owner: "418085944361484289",
        token: "token",
        mongodb: "mongodb://localhost:27017/reaction-ticket",
        channelId: "756178792619311289",
        categoryId: "756218456160075997",
        types: {
                "🗞️": { // الايموجي
                        name: "'طلب اعلان", // نوع التكت
                        roleId: "744615032687427636",
                        supportMessage: "قمت بفتح تكت لـ طلب اعلان , الرجاء كتابه أي نوع من الاعلانات تريده بعد قرائة <#747511468559302808>"
                },
                "👨‍🦰": { // الايموجي
                        name: "شكوى على الدعم الفني", // نوع التكت
                        roleId: "744615032687427636",
                        supportMessage: "الرجاء اتباع هذا النموذج , شكوى على : \n الدليل : \n وقت المشكله"
                },
                "✨": { // الايموجي
                        name: "أخرى", // نوع التكت
                        roleId: "744615032687427636",
                        supportMessage: "تفضل , كيف يمكنني مساعدتك"
                },
                "🛡️": { // الايموجي
                        name: "التقديم على الدعم الفني", // نوع التكت
                        roleId: "744615032687427636",
                        supportMessage: "للتقديم على الدعم الفني الرجاء كتابه التفاصيل الأتية , \n اسمك : , \n عمرك : , \n خبراتك ؟ : , \n كم ساعه تقدر تتفاعل فيها"
                }
        },
        cooldown: 300000,
        log: "751107906015068191"
};