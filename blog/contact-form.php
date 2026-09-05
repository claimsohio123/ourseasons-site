<?php
// TODO (siguiente paso): reemplazar CF7_FORM_ID por el ID real del formulario
// de Contact Form 7 creado en https://fourseasonsconstructionllc.com/wp-cms/wp-admin
$cf7_form_id = 'CF7_FORM_ID';
?>
<div class="wpcf7 no-js" data-wpcf7-id="<?php echo htmlspecialchars($cf7_form_id); ?>" dir="ltr" id="wpcf7-f<?php echo htmlspecialchars($cf7_form_id); ?>-o1" lang="en-US">
<div class="screen-reader-response"><p aria-atomic="true" aria-live="polite" role="status"></p> <ul></ul></div>
<form action="#wpcf7-f<?php echo htmlspecialchars($cf7_form_id); ?>-o1" aria-label="Contact form" class="wpcf7-form init use-floating-validation-tip" data-status="init" method="post" novalidate="novalidate">
<fieldset class="hidden-fields-container">
<input name="_wpcf7" type="hidden" value="<?php echo htmlspecialchars($cf7_form_id); ?>"/>
<input name="_wpcf7_version" type="hidden" value="6.1.7"/>
<input name="_wpcf7_locale" type="hidden" value="en_US"/>
<input name="_wpcf7_unit_tag" type="hidden" value="wpcf7-f<?php echo htmlspecialchars($cf7_form_id); ?>-o1"/>
<input name="_wpcf7_container_post" type="hidden" value="0"/>
<input name="_wpcf7_posted_data_hash" type="hidden" value=""/>
</fieldset>
<div class="form-container">
<div class="form-field">
<div class="form-field-wrap site-flex justify-content">
<div class="col-1 form-field-item form-field-name relative">
<label class="text-label c-green bold uppercase">
<span class="label-text sr-only">Name (required)</span>
<span class="wpcf7-form-control-wrap" data-name="fname"><input aria-required="true" class="wpcf7-form-control wpcf7-text wpcf7-validates-as-required form-input" maxlength="400" name="fname" placeholder="Name *" size="40" type="text" value=""/></span>
</label>
</div>
<div class="col-1 form-field-item form-field-number relative">
<label class="text-label c-green bold uppercase">
<span class="label-text sr-only">Phone Number (required)</span>
<span class="wpcf7-form-control-wrap" data-name="phone"><input aria-required="true" class="wpcf7-form-control wpcf7-tel wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-tel form-input" maxlength="400" name="phone" placeholder="Number *" size="40" type="tel" value=""/></span>
</label>
</div>
<div class="col-1 form-field-item form-field-email relative">
<label class="text-label c-green bold uppercase">
<span class="label-text sr-only">Email Address (required)</span>
<span class="wpcf7-form-control-wrap" data-name="email"><input aria-required="true" class="wpcf7-form-control wpcf7-email wpcf7-validates-as-required wpcf7-text wpcf7-validates-as-email form-input" maxlength="400" name="email" placeholder="Email *" size="40" type="email" value=""/></span>
</label>
</div>
<div class="col-1 form-field-item form-field-select relative">
<label class="text-label c-green bold uppercase">
<span class="label-text sr-only">Interested In (required)</span>
<span class="wpcf7-form-control-wrap" data-name="interest"><select aria-required="true" class="wpcf7-form-control wpcf7-select wpcf7-validates-as-required form-input" name="interest"><option value="Interested In:">Interested In:</option><option value="Residential Roofing">Residential Roofing</option><option value="Commercial Roofing">Commercial Roofing</option><option value="Gutters">Gutters</option><option value="Siding">Siding</option><option value="Other">Other</option></select></span>
</label>
</div>
<div class="col-1 form-field-item form-field-message relative">
<label class="text-label c-green bold uppercase">
<span class="label-text sr-only">Message (required)</span>
<span class="wpcf7-form-control-wrap" data-name="message"><textarea aria-required="true" class="wpcf7-form-control wpcf7-textarea wpcf7-validates-as-required form-input" cols="40" maxlength="2000" name="message" placeholder="Your message" rows="10"></textarea></span>
</label>
</div>
<div class="col-1 form-field-item form-field-desclaimer check relative"><span class="wpcf7-form-control-wrap" data-name="accept"><span class="wpcf7-form-control wpcf7-checkbox"><span class="wpcf7-list-item first"><label><input name="accept[]" type="checkbox" value="I provide my express consent to Four Seasons Construction, LLC to contact me via Phone and Email. I understand that my consent is not a requirement for purchase, and I may withdraw my consent at any time. Standard messaging rates may apply."/><span class="wpcf7-list-item-label">I provide my express consent to Four Seasons Construction, LLC to contact me via Phone and Email. I understand that my consent is not a requirement for purchase, and I may withdraw my consent at any time. Standard messaging rates may apply.</span></label></span><span class="wpcf7-list-item"><label><input name="accept[]" type="checkbox" value="By checking this box, I agree to receive texts from Four Seasons Construction LLC at this mobile number. Standard Messaging rates may apply."/><span class="wpcf7-list-item-label">By checking this box, I agree to receive texts from Four Seasons Construction LLC at this mobile number. Standard Messaging rates may apply.</span></label></span></span></span></div><br/>
<div class="col-1 form-field-item form-field-submit relative">
<button class="btn primary wpcf7-submit has-spinner" type="submit">Send Request <i class="fas fa-check-square"></i></button>
</div>
</div>
</div>
<div aria-hidden="true" class="wpcf7-response-output"></div>
</form>
</div>
