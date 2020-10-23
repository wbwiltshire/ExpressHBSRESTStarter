$(document).ready(function () {
    var baseUrl = '/api/';

    $('#createForm').submit(function (e) {
        //prevent Default functionality
        e.preventDefault();

        submitForm(this, baseUrl + 'customer')
    });

    function submitForm(form, url) {
        var formData = $(form).serialize();
        ajaxPost({
            url: url,
            data: formData,
            dataType: 'html',
            success: function (result, status, xhr) {
                //Clear form errors and forward
                forwardTo('/customer/');
            },
            error: function (result, status, xhr) {
                //Process UnprocessibleEntity
            }
        });
    };

    //forward to url from context menu
    function forwardTo(url) {
        window.location = url;
    };
});