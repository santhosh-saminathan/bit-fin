$(document).ready(function () {

    var contactButton = $("#contact-submit");


    contactButton.on('click', function (e) {
        e.preventDefault();

        // Get input field values of the contact form
        var contactFormInputs = $('#contact-form :input'),
            contactChecking = $('#contact-check-spam').val(),
            contactName = $('#contact-name').val(),
            contactEmail = $('#contact-email').val(),
            contactMessage = $('#contact-message').val(),
            contactAlertMessage = $('#contact-alert-message');

        // Disable Inputs and display a loading message
        contactAlertMessage.html('<p style="opacity: 1"><i class="fa fa-spinner fa-spin text-success"></i> Sending Message..</p>');
        contactButton.html('<i class="fas fa-spinner fa-spin"></i>');
        contactFormInputs.prop("disabled", true);

        // Data to be sent to server
        var post_data = {
            'form': 'contactForm',
            'contactSpamChecking': contactChecking,
            'contactName': contactName,
            'contactEmail': contactEmail,
            'contactMessage': contactMessage
        };

        // Ajax post data to server
        $.post('./php/bat/contact-form-gmail.php', post_data, function (response) {


            // Load jsn data from server and output message
            if (response.type === 'error') {

                contactAlertMessage.html('<p><i class="fa-lg far fa-times-circle text-danger"></i> ' + response.text + '</p>');
                contactButton.html('Send');
                contactFormInputs.prop("disabled", false);

            } else {

                contactAlertMessage.html('<p><i class="fa-lg far fa-check-circle text-success"></i> ' + response.text + '</p>');
                contactButton.html('Send');

                // After, all the fields are reset and enabled
                contactFormInputs.prop("disabled", false);
                $('#contact-name').val('');
                $('#contact-email').val('');
                $('#contact-message').val('');

            }

        }, 'json');

    });

});