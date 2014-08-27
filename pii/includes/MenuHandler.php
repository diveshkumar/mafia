<?php
/**
 * @package PII
 * @file
 *  This file will handle the Menu links for option pages.
 */

/**
 * Class Representing Menu Handler.
 */
class MenuHandler {

  public function __construct() {
    // Doing nothing.
  }

  /**
   * @method
   * Returning Menu options.
   */
  public function createMenu() {
    //create new top-level menu
    add_menu_page('PII Settings', 'PII Settings', 'administrator', __FILE__, array($this, 'settingsPage'));
  }
  /**
   * Creating a settings page for PII options.
   */
  public function settingsPage() {
    // Handling the submit for settings page.
    $this->_submitHandler();
    // Getting Default values for the fields.
    $fields = get_option('pii_fields');
    
    ?>
    <div class="wrap">
      <h2><?php echo __('PII Settings'); ?></h2>
      <p><?php echo __('Select the fields you want to be encrypted while storing in database.'); ?></p>
      <form name='pii-settings-form' method='post'>
        <?php wp_nonce_field('pii_settings', 'pii_settings_nonce'); ?>
        <input type='hidden' name='type' value='pii_settings' />
        <?php
        $options = $this->getFields();
        
        foreach ($options as $id => $label) {
          $is_checked = !empty($fields) ? (in_array($id, $fields) ? " checked": "") : '';
          ?>
          <div><label for='<?php print $id; ?>'><input type='checkbox' name='options[]' value='<?php print $id; ?>' <?php print $is_checked;?> /> <?php print str_replace('meta_', "", $label); ?></label><br/></div>
        <?php
        }
        print submit_button();
        ?>
      </form>
      
      <h2><?php echo __('Configure User Meta fields'); ?></h2>
      <form name='pii-custom-fields-form' method='post'>
        <?php wp_nonce_field('pii_custom_meta_fields', 'pii_custom_meta_fields_nonce'); ?>
        <input type='hidden' name='type' value='pii_custom_meta_fields' />
        <?php
        $custom_fields = $this->getCustomFields();
        ?>
        <div>
            <label for='pii_custom_meta_fields'><?php echo __('Provide a "," separated list of multiple user meta keys to apply encryption. <br/> E.g. <b>first_name,last_name</b> etc.'); ?></br></label>
            <textarea cols='80' rows='10' id='pii_custom_meta_fields' name='pii_custom_meta_fields'><?php print $custom_fields;?></textarea></div>
        <?php 
        print submit_button('Add usermeta fields');
        ?>
      </form>
    </div>
    <?php
  }
  
  /**
   * Submit handler for PII settings through settings page.
   */
  private function _submitHandler() {
    // Checking if this is a valid settings submit handler.
    if (!empty($_POST) && isset($_POST['type']) && $_POST['type'] == 'pii_settings' && (isset( $_POST['pii_settings_nonce'] ) 
    || wp_verify_nonce( $_POST['pii_settings_nonce'], 'pii_settings' )) ) {
      update_option('pii_fields', $_POST['options']);
      $encryption = new EncryptDecrypt();
      $encryption->updateFields($_POST['options']);
    }
    // Meta fields saving.
    else if (!empty($_POST) && isset($_POST['type']) && $_POST['type'] == 'pii_custom_meta_fields' && (isset( $_POST['pii_custom_meta_fields_nonce'] ) 
    || wp_verify_nonce( $_POST['pii_custom_meta_fields_nonce'], 'pii_custom_meta_fields' )) ) {
      update_option('pii_custom_meta_fields', trim($_POST['pii_custom_meta_fields'])); 
    }
  }

  /**
   * @method
   * This method would return list fields to be shown on settings page.
   */
  public function getFields($key = FALSE) {
    $fields = array(
      'user_email'    => __('user_email'),
      'display_name'  => __('display_name')
    );
    $custom_meta_fields = get_option('pii_custom_meta_fields');
    $custom_meta_fields = !empty($custom_meta_fields) ? explode(",", $custom_meta_fields) : $custom_meta_fields;
    array_walk($custom_meta_fields, array($this, '_formatMetaFields'));
    $fields = (!empty($custom_meta_fields) && !empty($fields)) ? array_merge(array_keys($fields), $custom_meta_fields) : $fields;
    $fields = array_combine($fields, $fields);
    return ($key === TRUE) ?  $fields : $fields;
  }

  /**
   * @method
   * Method would return list fields to be shown on settings page.
   */
  public function getCustomFields($key = FALSE) {
    $custom_fields = get_option('pii_custom_meta_fields');
    return $custom_fields;
  }
  
  /**
   * @method
   * Method will format MEta fields.
   * 
   */
  private function _formatMetaFields(&$value) {
    $value = 'meta_' . $value;
  }
}

$menuHandler = new MenuHandler();
// Registring menu.
add_action('admin_menu', array($menuHandler, 'createMenu'));
